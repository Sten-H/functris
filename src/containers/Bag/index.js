import * as React from 'react';
import * as constants from '../../reducers/tetris/logic/constants';
import { EMPTY_TOKEN } from "../../reducers/tetris/logic/constants/index";
import { drawBoard, getBoardWithPiece } from "../commons";
import { connect } from "react-redux";
import { __, compose, head, lensProp, set } from "ramda";
const piece = constants.PIECES.L;

const pieceLens = lensProp('piece');
const mockBoard = new Array(5).fill(new Array(5).fill(EMPTY_TOKEN));
const mockState = {board: mockBoard, pos: [2, 2], piece: piece};

// bag -> JSXElement
const drawNextPiece = compose(
    drawBoard,
    getBoardWithPiece,
    set(pieceLens, __, mockState),
    head
);

class Bag extends React.Component {
    render() {
        return (
            <div>
                <div className="col-12">
                    <h4 className="text-left">Next</h4>
                    <div>
                        {drawNextPiece(this.props.bag)}
                    </div>
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

export function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bag);
