import React from 'react';
import { connect } from 'react-redux';
import './Tetris.css';
import * as actions from "../../actions/actions";
import KeyHandler from 'react-key-handler';
import { drawBoard, getBoardWithPiece } from "../commons";


class Tetris extends React.Component {
    render() {
        return (
        <div className="tetris-game dotted-border">
            <KeyHandler keyValue="ArrowLeft" onKeyHandle={this.props.onLeftPress} />
            <KeyHandler keyValue="ArrowRight" onKeyHandle={this.props.onRightPress} />
            <KeyHandler keyValue="ArrowDown" onKeyHandle={this.props.onDownPress} />
            <KeyHandler keyValue="ArrowUp" onKeyHandle={this.props.onRotateClockwisePress} />
            <KeyHandler keyValue="Space" onKeyHandle={this.props.onDropPress} />
            <KeyHandler keyValue="z" onKeyHandle={this.props.onRotateClockwisePress} />
            <KeyHandler keyValue="x" onKeyHandle={this.props.onRotateCounterPress} />
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

export function mapDispatchToProps(dispatch) {
    return {
        onLeftPress: () => dispatch(actions.shiftLeft()),
        onRightPress: () => dispatch(actions.shiftRight()),
        onDownPress: () => dispatch(actions.shiftDown()),
        onDropPress: () => dispatch(actions.dropPiece()),
        onRotateClockwisePress: () => dispatch(actions.rotateClockwise()),
        onRotateCounterPress: () => dispatch(actions.rotateCounter()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tetris);
