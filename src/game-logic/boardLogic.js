import {
	__, always, any, anyPass, complement, compose, concat, converge, countBy, curry, dissocPath, equals,
	filter,
	flatten, gte,
	identity, ifElse,
	isNil, length, lt,
	map, over, prop, reduce, reject, repeat, set, subtract, view
} from 'ramda';
import { boardLens, cellLens, pieceActualPosition, pieceTokenLens, xLens, yLens } from './helpers';
import * as c from './constants';

/**
 * Board logic contains validators if a piece or coord is out of board bounds, it also has transformers
 * for board state to write a piece to board or to clear lines.
 */
// string -> row -> number
export const tokensInRow = curry((token, row) => compose(
	ifElse(isNil, always(0), identity),
	prop('true'),
	countBy(equals(token)),
)(row));
// VALIDATORS
// string -> boolean
const isCellEmpty = equals(c.EMPTY_TOKEN);
// string -> boolean
const isCellFilled = complement(isCellEmpty);

// (lens, [predicates]) -> f(coord) -> boolean
const coordValidator = (lens, predicates) =>
	compose(
		anyPass(predicates),
		view(lens)
	);
// coord -> boolean
const isXOutOfBounds = coordValidator(
	xLens,
	[
		lt(__, 0),
		gte(__, c.COL_COUNT)
	]);
// coord -> boolean
const isBottomYOutOfBounds = coordValidator(yLens, [ gte(__, c.ROW_COUNT) ]);
// coord -> boolean
const isTopYOutOfBounds = coordValidator(yLens, [ lt(__, 0) ]);

// coord -> boolean, above board top does not count as out of bounds, can move piece freely at top.
export const isCoordOutOfBounds = anyPass([isXOutOfBounds, isBottomYOutOfBounds]);

// state -> boolean
export const isPieceOutOfBounds = compose(
	any(isCoordOutOfBounds),
	pieceActualPosition
);
// (board -> coord) -> str, cell value is string (token symbol), returns empty on out of bounds coord
export const getCell = curry((state, coord) =>
	ifElse(
		anyPass([isTopYOutOfBounds, isCoordOutOfBounds]),
		always(c.EMPTY_TOKEN),
		compose(
			view(__, state),
			cellLens
		)
	)(coord)
);
// state -> coord -> boolean
export const isCoordOverlapping = (state) =>
	compose(
		isCellFilled,
		getCell(state)
	);
// state -> boolean
export const isPieceOverlapping =
	converge(
		any,
		[isCoordOverlapping, pieceActualPosition]
	);
const isRowTokenCountEqual = curry((n, token, row) => equals(n, tokensInRow(token, row)));
// row -> boolean
export const isRowEmpty = isRowTokenCountEqual(c.COL_COUNT, c.EMPTY_TOKEN);
// row -> boolean
export const isRowFull = isRowTokenCountEqual(0, c.EMPTY_TOKEN);
// state -> state
export const clearAllRows = over(boardLens, reject(isRowFull));
// state -> state
export const addEmptyRows =
	(state, rowAmount) => over(boardLens, concat(repeat(c.EMPTY_ROW, rowAmount)), state);
// state -> state
export const clearLines = compose(
	converge(
		addEmptyRows,
		[identity, compose(subtract(c.ROW_COUNT), length, view(boardLens))]
	),
	clearAllRows
);

// (state, coord) -> state, fills with current token symbol
const fillCell = (state, coord) => converge(
	set(cellLens( coord )),
	[view(pieceTokenLens), identity],
)(state);

// state -> state
export const writeToBoard = converge(
	reduce(fillCell),
	[identity, pieceActualPosition]
);