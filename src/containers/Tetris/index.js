import React from 'react';
import { connect } from 'react-redux';
import { map, addIndex, lensPath, set, reverse, reduce, prop, converge } from 'ramda';
import './Tetris.css';
import * as actions from "../../actions/actions";
import KeyHandler from 'react-key-handler';
import { pieceActualPosition } from "../../reducers/tetris/logic/logic";
import { FILL_TOKEN } from "../../reducers/tetris/logic/constants/index";
// (r, i) -> JSXElement
const drawRow = (row, i) => <p key={i} className="tetris-row">{row}</p>;
// board -> [JSXElement]
const drawBoard = addIndex(map)(drawRow);
// (board, coord) -> board
const fillCoord = (board, coord) => {
    const lens = lensPath(reverse(coord));
    return set(lens, FILL_TOKEN, board);
};
// state -> board
const getBoardWithPiece =
    converge(
        reduce(fillCoord),
        [
            prop('board'),
            pieceActualPosition
        ]
    );

class Tetris extends React.Component {
    // tickState = {
    //     TICK_RATE: 100,
    //     timer: null,  // setInterval func
    //     counter: 0,  // Is increased by 1 every tick
    //     speed: 10,  // counter % speed == 1 is when action is dispatched
    // };
    render() {
        return (
        <div className="tetris-game">
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
