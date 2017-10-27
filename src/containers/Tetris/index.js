import React from 'react';
import { connect } from 'react-redux';
import { map, addIndex } from 'ramda';
import './Tetris.css';
import { shiftLeft, shiftRight } from "../../actions/actions";
import KeyHandler from 'react-key-handler';

const drawRow = (row, i) => <p key={i} className="tetris-row">{row}</p>;
const drawBoard = addIndex(map)(drawRow);

class Tetris extends React.Component {
    render() {
        return (
        <div className="tetris-game">
            <KeyHandler keyValue="ArrowLeft" onKeyHandle={this.props.onLeftPress} />
            <KeyHandler keyValue="ArrowRight" onKeyHandle={this.props.onRightPress} />
            <KeyHandler keyValue="z" onKeyHandle={() => log("z")} />
            <KeyHandler keyValue="x" onKeyHandle={() => log("x")} />
            {drawBoard(this.props.board)}
        </div>
        );
    };
}
const log = (str) => console.log(str);
const mapStateToProps = (state) => {
    return {
        board: state.tetris.board,
        position: state.tetris.position,
        piece: state.tetris.piece
    };
};

export function mapDispatchToProps(dispatch) {
    return {
        onLeftPress: ({piece, board}) => dispatch(shiftLeft({board, piece})),
        onRightPress: ({piece, board}) => dispatch(shiftRight({board, piece}))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tetris);
