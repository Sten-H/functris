import * as React from 'react';
import * as constants from '../../game-logic/constants';
import { EMPTY_TOKEN } from "../../game-logic/constants/index";
import { drawBoard } from "../commons";
import { connect } from "react-redux";
import { __, compose, head, isNil, not, set, when } from "ramda";
import { lens } from '../../game-logic/helpers';

// FIXME What's going on here why is it mocked?
const piece = constants.PIECES.L;
const mockBoard = new Array(5).fill(new Array(5).fill(EMPTY_TOKEN));
const mockState = {board: mockBoard, pos: [2, 2], piece: piece, options: {shadow: false}};

const notNil = compose(not, isNil);
// bag -> JSXElement
const drawNextPiece = compose(
    drawBoard,
    set(lens.piece, __, mockState),
    head
);
// bag -> JSXElement
const drawIfDefined =
    when(
        notNil,
        drawNextPiece
    );

class Bag extends React.Component {
    render() {
        return (
            <div className="col-12">
                <h4 className="text-left">Next</h4>
                <div className="next-piece-wrapper">
                    {drawIfDefined(this.props.bag)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bag: state.tetris.bag
    };
};

export default connect(mapStateToProps)(Bag);
