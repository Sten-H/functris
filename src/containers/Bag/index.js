import * as React from 'react';
import * as constants from '../../reducers/tetris/logic/constants';
import { EMPTY_TOKEN } from "../../reducers/tetris/logic/constants/index";
import { drawBoard, getBoardWithPiece } from "../commons";
import { connect } from "react-redux";
import { __, compose, head, isNil, not, set, when } from "ramda";
import { pieceLens } from '../../reducers/tetris/logic/helpers';
const piece = constants.PIECES.L;


const mockBoard = new Array(5).fill(new Array(5).fill(EMPTY_TOKEN));
const mockState = {board: mockBoard, pos: [2, 2], piece: piece};

const notNil = compose(not, isNil);
// bag -> JSXElement
const drawNextPiece = compose(
    drawBoard,
    getBoardWithPiece,
    set(pieceLens, __, mockState),
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
