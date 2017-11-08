import * as React from 'react';
import {
	__,
	addIndex, always, compose, concat, converge, curry, identity, ifElse, inc, lensPath, map, merge, objOf,
	prop, reduce, reverse, set, takeLast, view,
} from 'ramda';
import * as c from '../game-logic/constants';
import { equals } from 'ramda';
import { pieceActualPosition, lens } from '../game-logic/helpers';
import * as tetris from '../game-logic/main';

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
const drawRow = (row, i) =>
	<div key={i} className={(i !== 0) ? 'tetris-row' : 'tetris-row half-row'} >
		{addIndex(map)(drawBlock, row)}
	</div>;
// state -> piece -> state
const fillBoardWithPiece = curry((state, piece) =>
	compose(
		set(lens.board, __, state),
		converge(
			reduce(fillCoord(piece.token)),
			[
				prop(['board']),
				always(piece.coords)
			]
		))(state));
// (f, g) -> state -> piece
const getActual = (pieceFunc, tokenFunc) =>
	converge(
		merge,
		[
			compose(objOf('coords'), pieceFunc),
			compose(objOf('token'), tokenFunc)
		]
	);
// state -> piece, gets piece with absolute coords
const getActualPiece = getActual(pieceActualPosition, view(lens.pieceToken));
const getActualShadow =
	ifElse(
		view(lens.options.shadow),
		getActual(tetris.getShadow, compose(concat(__, ` ${c.SHADOW_TOKEN}`), view(lens.pieceToken))),
		always({coords: [], token: 'NONE'}) // dummy object, when shadow disabled
	);
// state -> [piece]
const getAllPieces =
	converge(
		Array,
		[
			getActualShadow,
			getActualPiece,
		]
);
// state -> state
const fillBoard =
	converge(
		reduce(fillBoardWithPiece),
		[identity, getAllPieces]
	);
export const drawBoard = compose(
	addIndex(map)(drawRow),
	takeLast(inc(c.LEGAL_ROWS)),
	prop('board'),
	fillBoard
);