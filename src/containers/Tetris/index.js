import React from 'react';
import { connect } from 'react-redux';
import * as actions from "../../actions/actions";
import KeyHandler from 'react-key-handler';
import { drawBoard, getBoardWithPiece } from "../commons";
import { append, last, map, multiply, uniq, view } from 'ramda';
import { lens } from '../../game-logic/helpers';

import './Tetris.css';
const scaleFactor = 1;
const keyTickRate = 5;
/**
 * These counter values can be set to Tetris component's state.activeCounter, they determine the
 * wait time for next key input to be executed. The first appearance of a keypress (not same as previous key press) is
 * executed instantly, but after first press there is a big one time delay (keyCounterInitialWait), and if user keeps holding
 * the key will execute fast (keyCounterRepeatWait).  This is called delayed auto shift. It is harder to trigger
 * the auto shift on the rotation (takes longest time), and easiest on shift down.
 */
const keyCounterInitialWait = {
	left: keyTickRate * 25,
		right: keyTickRate * 25,
		up: keyTickRate * 50,
		down: keyTickRate * 10
};
const keyCounterRepeatWait = {
	left: keyTickRate * 2,
		right: keyTickRate * 2,
		up: keyTickRate * 7,
		down: keyTickRate
};
class Tetris extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			prevKey: 'none',
			keyQueue: [],
			activeCounter: -1,

			executePress: false
		}
	}
	shiftTick() {
		this.props.onDownPress();
		setTimeout(this.shiftTick.bind(this), view(lens.options.tick, this.props.gameState));
	}
	updateKeyPress = (key) => {
		if(this.state.prevKey !== key) {
			this.state.executePress = true;
			this.state.activeCounter = keyCounterInitialWait[key];
		} else if (this.state.activeCounter <= 0) {
			this.state.executePress= true;
			this.state.activeCounter = keyCounterRepeatWait[key];
		} else {
			this.state.activeCounter -= keyTickRate;
		}
		return this.state;
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
	addKeyToQueue = (key) => this.state.keyQueue = append(key, this.state.keyQueue);
	handleInputQueue = (key) => {
		this.state = this.updateKeyPress(key);
		if(this.state.executePress) {
			this.executeKeyPress(key, this.props);
		}
		this.state.executePress = false;
		this.state.prevKey = key;
	};
	keyTick() {
		map(this.handleInputQueue.bind(this), uniq(this.state.keyQueue));
		this.state.keyQueue = (this.state.keyQueue.length > 0 ) ? [last(this.state.keyQueue)] : [];
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
            <KeyHandler keyEventName={'keydown'} keyValue='ArrowLeft' onKeyHandle={() => this.addKeyToQueue('left')} />
            <KeyHandler keyEventName={'keyup'} keyValue='ArrowLeft' onKeyHandle={() => this.addKeyToQueue('none')} />
            <KeyHandler keyEventName={'keydown'} keyValue='ArrowRight' onKeyHandle={() => this.addKeyToQueue('right')} />
            <KeyHandler keyEventName={'keyup'} keyValue='ArrowRight' onKeyHandle={() => this.addKeyToQueue('none')} />
	        <KeyHandler keyEventName={'keydown'} keyValue='ArrowUp' onKeyHandle={() => this.addKeyToQueue('up')} />
	        <KeyHandler keyEventName={'keyup'} keyValue='ArrowUp' onKeyHandle={() => this.addKeyToQueue('none')} />
	        <KeyHandler keyEventName={'keydown'} keyValue='ArrowDown' onKeyHandle={() => this.addKeyToQueue('down')} />
            <KeyHandler keyEventName={'keyup'} keyValue='ArrowDown' onKeyHandle={() => this.addKeyToQueue('none')} />
	        {/* END DELAYED AUTO SHIFT KEYS */}
            <KeyHandler keyValue=' ' onKeyHandle={this.props.onDropPress} />
            <KeyHandler keyValue='z' onKeyHandle={this.props.onRotateClockwisePress} />
            <KeyHandler keyValue='x' onKeyHandle={this.props.onRotateCounterPress} />
	        {/* FIXME This key is just here for testing things out, remove later */}
            <KeyHandler keyValue='t' onKeyHandle={this.props.onDecreasePress} />
            <KeyHandler keyValue='p' onKeyHandle={this.props.onPausePress} />
            <KeyHandler keyValue='r' onKeyHandle={this.props.onRestartPress} />
            {drawBoard(getBoardWithPiece(this.props.gameState))}
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
