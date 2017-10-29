import * as React from 'react';
import * as constants from '../../reducers/tetris/logic/constants';
import { EMPTY_TOKEN } from "../../reducers/tetris/logic/constants/index";
import { drawBoard, getBoardWithPiece } from "../commons";
const piece = constants.PIECES.L;

const mockBoard = new Array(5).fill(new Array(5).fill(EMPTY_TOKEN));
const mockState = {board: mockBoard, position: [2, 2], piece: piece};
export const Bag = () => {
    return (
        <div>
            <div className="col-12">
                <h4 className="text-left">Next</h4>
                <div>
                    {/*{drawBoard(getBoardWithPiece(mockState))}*/}
                </div>
            </div>
        </div>
    );
} ;