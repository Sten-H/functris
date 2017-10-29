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
            <KeyHandler keyValue="ArrowUp" onKeyHandle={this.props.onUpPress} />
            <KeyHandler keyValue="z" onKeyHandle={this.props.onUpPress} />
            <KeyHandler keyValue="x" onKeyHandle={this.props.onXPress} />
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
        onUpPress: () => dispatch(actions.rotateClockwise()),
        onXPress: () => dispatch(actions.rotateCounter())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tetris);
