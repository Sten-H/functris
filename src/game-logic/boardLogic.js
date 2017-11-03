import { __, always, any, anyPass, complement, compose, converge, curry, equals, gte, identity, ifElse, lt,
	map, over, reduce, set, view } from 'ramda';
import { boardLens, cellLens, pieceActualPosition, pieceTokenLens, xLens, yLens } from './helpers';
import * as c from './constants/index';

/**
 * Board logic contains validators if a piece or coord is out of board bounds, it also has transformers
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
// );
// state -> boolean
export const isPieceOverlapping =
	converge(
		any,
		[isCoordOverlapping, pieceActualPosition]
	);

const isRowFull = () => null;

// TRANSFORMERS
export const clearLines = identity;
// export const clearLines = over(
// 	boardLens,
// 	map()
// );

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