import React from 'react';
import { connect } from 'react-redux';
import * as actions from "../../actions/actions";
import KeyHandler from 'react-key-handler';
import { drawBoard, getBoardWithPiece } from "../commons";
import { view } from 'ramda';
import { lens } from '../../game-logic/helpers';

import './Tetris.css';

class Tetris extends React.Component {
	tick() {
		this.props.onDownPress();
		setTimeout(this.tick.bind(this), view(lens.options.tick, this.props.gameState));
	}
	componentDidMount() {
		if(!this.props.isTest) {
			this.tick();  // Don't run tick in tests
		}
    }
    render() {
        return (
        <div className='tetris-game solid-border'>
            <KeyHandler keyValue='ArrowLeft' onKeyHandle={this.props.onLeftPress} />
            <KeyHandler keyValue='ArrowRight' onKeyHandle={this.props.onRightPress} />
            <KeyHandler keyValue='ArrowDown' onKeyHandle={this.props.onDownPress} />
            <KeyHandler keyValue='ArrowUp' onKeyHandle={this.props.onRotateClockwisePress} />
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
