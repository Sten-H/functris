import * as React from 'react';
import { addIndex, converge, lensPath, map, prop, reduce, reverse, set } from "ramda";
import { pieceActualPosition } from "../reducers/tetris/logic/logic";
import { FILL_TOKEN } from "../reducers/tetris/logic/constants/index";

// (board, coord) -> board, sets cell to FILL_TOKEN value
const fillCoord = (board, coord) => {
    const lens = lensPath(reverse(coord));
    return set(lens, FILL_TOKEN, board);
};
const drawBlock = (block) => {
    if(block === FILL_TOKEN) {
        return <span className="block cyan"/>;
    } else {
        return <span className="block" />;
    }
};
// (r, i) -> JSXElement
const drawRow = (row, i) => <div key={i} className="tetris-row">{map(drawBlock, row)}</div>;
// board -> [JSXElement]
export const drawBoard = addIndex(map)(drawRow);
// state -> board
export const getBoardWithPiece =
    converge(
        reduce(fillCoord),
        [
            prop('board'),
            pieceActualPosition
        ]
    );