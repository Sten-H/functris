import * as React from 'react';
import { addIndex, always, compose, converge, curry, ifElse, lensPath, map, prop, reduce, reverse, set } from "ramda";
import { pieceActualPosition } from "../reducers/tetris/logic/logic";
import { FILL_TOKEN } from "../reducers/tetris/logic/constants/index";
import { equals } from "ramda";

/**
 * The drawBoard function is generalized because it is also used in the next piece component
 * which draws like a mini board to show the piece
 */
// lens for accessing board cells, board cells are accessed [y x] so incoming coord is reversed before lens
const cellLens = compose(lensPath, reverse);
// (board, coord) -> board, sets cell to FILL_TOKEN value
const fillCoord = curry((board, coord) => set(cellLens(coord), FILL_TOKEN, board));
// (content, i) -> JSXElement
const drawBlock = (content, idx) =>
    ifElse(
        equals(FILL_TOKEN),
        always(<span key={idx} className="piece-cyan" />),
        always(<span key={idx} className="empty-cell" />)
    )(content);
// (r, i) -> JSXElement
const drawRow = (row, i) => <div key={i} className="tetris-row" >{addIndex(map)(drawBlock, row)}</div>;
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