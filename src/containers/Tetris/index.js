import React from 'react';
import { connect } from 'react-redux';
import * as actions from "../../actions/actions";
import KeyHandler, { KEYDOWN, KEYUP } from 'react-key-handler';
import { drawBoard } from "../../tetris-logic/draw-logic/draw";
import { append, last, map, uniq, view } from 'ramda';
import { lens } from '../../tetris-logic/game-logic/helpers';

import './Tetris.css';
/**
 * These counter values can be set to Tetris component's state.activeCounter, they determine the
 * wait time for next key input to be executed. The first appearance of a keypress (not same as previous key press) is
 * executed instantly, but after first press there is a big one time delay (keyCounterInitialWait), and if user keeps holding
 * the key will execute fast (keyCounterRepeatWait).  This is called delayed auto shift. It is harder to trigger
 * the auto shift on the rotation (takes longest time), and easiest on shift down.
 */
const keyTickRate = 5;  // How often the keys pressed queue is being checked (in ms)
const scaleFactor = 1;
const keyCounterInitialWait = {
	left: keyTickRate * 20 * scaleFactor,
		right: keyTickRate * 20 * scaleFactor,
		up: keyTickRate * 50 * scaleFactor,
		down: keyTickRate * 10 * scaleFactor
};
const keyCounterRepeatWait = {
	left: keyTickRate * 2 * scaleFactor,
		right: keyTickRate * 2 * scaleFactor,
		up: keyTickRate * 7 * scaleFactor,
		down: keyTickRate * scaleFactor
};
let activeKeyValues = {
	prevKey: 'none',
	keyQueue: [],
	activeCounter: -1,
	executePress: false
};
const setActive = (obj) => activeKeyValues = {...activeKeyValues, ...obj};
class Tetris extends React.Component {
	shiftTick() {
		this.props.onDownPress();
		setTimeout(this.shiftTick.bind(this), view(lens.options.tick, this.props.gameState));
	}
	updateKeyPress = (key) => {
		if(activeKeyValues.prevKey !== key) {
			setActive({
				executePress: true,
				activeCounter: keyCounterInitialWait[key]
				}
			);
		} else if (activeKeyValues.activeCounter <= 0) {
			setActive({
				executePress: true,
				activeCounter: keyCounterRepeatWait[key]
			});
		} else {
			const newCounter = activeKeyValues.activeCounter - keyTickRate;
			setActive({
				activeCounter: newCounter
			});
		}
	};
	executeKeyPress = (key) => {
		switch(key) {
			case 'left':
				this.props.onLeftPress();
				return;
			case 'right':
				this.props.onRightPress();
				return;
			case 'up':
				this.props.onRotateClockwisePress();
				return;
			case 'down':
				this.props.onDownPress();
				return;
			default:
				return;
		}
	};
	addKeyToQueue = (key) => setActive({keyQueue: append(key, activeKeyValues.keyQueue)});
	handleInputQueue = (key) => {
		this.updateKeyPress(key);
		if(activeKeyValues.executePress) {
			this.executeKeyPress(key, this.props);
		}
		setActive({
			executePress: false, prevKey: key});
	};
	keyTick() {
		map(this.handleInputQueue.bind(this), uniq(activeKeyValues.keyQueue));
		activeKeyValues.keyQueue = (activeKeyValues.keyQueue.length > 0 ) ? [last(activeKeyValues.keyQueue)] : [];
		setTimeout(this.keyTick.bind(this), 10);
	}
	componentDidMount() {
		if(!this.props.isTest) {
			this.shiftTick();  // Don't run shiftTick in tests
			this.keyTick()
		}
    }
    render() {
        return (
        <div className='tetris-game solid-border'>
	        {/* START DELAYED AUTO SHIFT KEYS */}
            <KeyHandler keyEventName={KEYDOWN} keyValue='ArrowLeft' onKeyHandle={() => this.addKeyToQueue('left')} />
            <KeyHandler keyEventName={KEYUP} keyValue='ArrowLeft' onKeyHandle={() => this.addKeyToQueue('none')} />
            <KeyHandler keyEventName={KEYDOWN} keyValue='ArrowRight' onKeyHandle={() => this.addKeyToQueue('right')} />
            <KeyHandler keyEventName={KEYUP} keyValue='ArrowRight' onKeyHandle={() => this.addKeyToQueue('none')} />
	        <KeyHandler keyEventName={KEYDOWN} keyValue='ArrowUp' onKeyHandle={() => this.addKeyToQueue('up')} />
	        <KeyHandler keyEventName={KEYUP} keyValue='ArrowUp' onKeyHandle={() => this.addKeyToQueue('none')} />
	        <KeyHandler keyEventName={KEYDOWN} keyValue='ArrowDown' onKeyHandle={() => this.addKeyToQueue('down')} />
            <KeyHandler keyEventName={KEYUP} keyValue='ArrowDown' onKeyHandle={() => this.addKeyToQueue('none')} />
	        {/* END DELAYED AUTO SHIFT KEYS */}
            <KeyHandler keyValue=' ' onKeyHandle={this.props.onDropPress} />
            <KeyHandler keyValue='z' onKeyHandle={this.props.onRotateClockwisePress} />
            <KeyHandler keyValue='x' onKeyHandle={this.props.onRotateCounterPress} />
	        {/* FIXME This key is just here for testing things out, remove later */}
            <KeyHandler keyValue='t' onKeyHandle={this.props.onDecreasePress} />
            <KeyHandler keyValue='p' onKeyHandle={this.props.onPausePress} />
            <KeyHandler keyValue='r' onKeyHandle={this.props.onRestartPress} />
            {drawBoard(this.props.gameState)}
        </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        gameState: state.tetris
    };
};

function mapDispatchToProps(dispatch) {
    return {
	    onRestartPress: () => dispatch(actions.restartGame()),
    	onPausePress: () => dispatch(actions.togglePause()),
    	onDecreasePress: () => dispatch(actions.decreaseTick()),
        onLeftPress: () => dispatch(actions.shiftLeft()),
        onRightPress: () => dispatch(actions.shiftRight()),
        onDownPress: () => dispatch(actions.shiftDown()),
        onDropPress: () => dispatch(actions.dropPiece()),
        onRotateClockwisePress: () => dispatch(actions.rotateClockwise()),
        onRotateCounterPress: () => dispatch(actions.rotateCounter()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tetris);
