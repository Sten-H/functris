import * as React from 'react';
import {
    addIndex, always, compose, converge, curry, ifElse, lensPath, map, prop, reduce, reverse, set,
    view
} from 'ramda';
import * as c from '../game-logic/constants';
import { equals } from 'ramda';
import { pieceActualPosition, lens } from '../game-logic/helpers';

/**
 * The drawBoard function is generalized because it is also used in the next piece component
 * which draws like a mini board to show the piece
 */
// lens for accessing board cells, board cells are accessed [y x] so incoming coord is reversed before lens
const cellLens = compose(lensPath, reverse);
// (board, coord) -> board, sets cell to FILL_TOKEN value
const fillCoord = curry((token, board, coord) => set(cellLens(coord), token, board));
// (content, i) -> JSXElement
const drawBlock = (content, idx) =>
    ifElse(
        equals(c.EMPTY_TOKEN),
        always(<span key={idx} className='empty-cell' />),
        always(<span key={idx} className={`piece-${content}`} />)
)(content);
// (r, i) -> JSXElement
const drawRow = (row, i) => <div key={i} className='tetris-row' >{addIndex(map)(drawBlock, row)}</div>;
// board -> [JSXElement]
export const drawBoard = addIndex(map)(drawRow);
// state -> board
export const getBoardWithPiece = (state) =>
    converge(
        reduce(
            fillCoord(view(lens.pieceToken, state))),
        [
            prop(['board']),
            pieceActualPosition
        ]
    )(state);