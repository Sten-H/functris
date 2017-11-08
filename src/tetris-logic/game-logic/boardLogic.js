import {
	__, always, any, anyPass, complement, compose, concat, converge, curry, either, equals, filter, gte,
	identity, ifElse, length, lt, over, reduce, reject, repeat, set, take, takeLast, view
} from 'ramda';
import { pieceActualPosition, lens } from './helpers';
import * as c from './constants/index';

/**
 * Board tetris contains validators if a piece or coord is out of board bounds, it also has transformers
 * for board state to write a piece to board or to clear lines.
 */
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
// coord -> boolean, for all out of bounds validators
const isXOutOfBounds = coordValidator(lens.coord.x, [ lt(__, 0), gte(__, c.COL_COUNT) ]);
const isBottomYOutOfBounds = coordValidator(lens.coord.y, [ gte(__, c.ROW_COUNT) ]);
const isTopYOutOfBounds = coordValidator(lens.coord.y, [ lt(__, 0) ]);
const isYOutOfBounds = either(isBottomYOutOfBounds, isTopYOutOfBounds);

// coord -> boolean, above board top does not count as out of bounds, can move piece freely at top.
export const isCoordOutOfBounds = anyPass([isXOutOfBounds, isYOutOfBounds]);

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
			lens.cell
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
const rowContainsNOfToken = (n, token) => compose(equals(n), length, filter(equals(token)));
// row -> boolean
export const isRowEmpty = rowContainsNOfToken(c.COL_COUNT, c.EMPTY_TOKEN);
// row -> boolean
const isNotRowEmpty = complement(isRowEmpty); // note not same as full, just filled somewhat
// row -> boolean
export const isRowFull = rowContainsNOfToken(0, c.EMPTY_TOKEN);
// export const rowContainsFillTokens =
export const isTopOut = compose(
	any(isNotRowEmpty),
	take(c.ILLEGAL_ROWS),
	view(lens.board)
);
// state -> state
export const clearAllRows = over(lens.board, reject(isRowFull));
// state -> state
export const addEmptyRows = compose(
	over(lens.board, takeLast(c.ROW_COUNT)),  // actual board
	over(lens.board, concat(repeat(c.EMPTY_ROW, c.MAX_CLEAR)))  // 4 empty to top (max cleared)
);
// state -> state
export const clearLines = compose(
	addEmptyRows,
	clearAllRows
);
// (state, coord) -> state, fills with current token symbol
const fillCell = (state, coord) => converge(
	set(lens.cell( coord )),
	[view(lens.pieceToken), identity],
)(state);

// state -> state
export const writeToBoard = converge(
	reduce(fillCell),
	[identity, pieceActualPosition]
);