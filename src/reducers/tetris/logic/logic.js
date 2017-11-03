import {
	add, any, compose, converge, curry, dec, equals, head, inc, last, lensIndex, map, multiply,
	over, zipWith, reverse, __, when, gte, lt, view, or, not, lensProp, anyPass, ifElse, identity, lensPath,
	concat, set, reduce, always, complement, until, clamp
} from 'ramda';
import * as constants from './constants';
import { COL_COUNT, EMPTY_TOKEN, FILL_TOKEN, ROW_COUNT } from './constants/index';
import { getNextPiece } from "./bagLogic";
import { addCoords, cellLens, normalizeCoord, pieceCoordLens, pieceTokenLens, posLens, xLens, yLens } from './helpers';

/**
 * Logic mostly contained to moving/rotating/dropping piece, though it also handles writing piece to board
 * and calling to get the next piece. Which is a bit outside its responsibility. Maybe refactor this somehow
 */


// (board -> coord) -> str, cell value is string (token symbol), returns empty on out of bounds coord
export const getCell = curry((state, coord) =>
	ifElse(
		anyPass([isTopYOutOfBounds, isCoordOutOfBounds]),
		always(EMPTY_TOKEN),
		compose(
			view(__, state),
			cellLens
		)
	)(coord)
);
// state -> piece, adds position value to each piece coord to get true position
export const pieceActualPosition = converge(
    map,
    [compose(addCoords, view(posLens)), view(pieceCoordLens)]
);
// string -> boolean
const isCellEmpty = equals(EMPTY_TOKEN);
// string -> boolean
const isCellFilled = complement(isCellEmpty);

// VALIDATORS
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
        gte(__, constants.COL_COUNT)
    ]);
// coord -> boolean
const isBottomYOutOfBounds = coordValidator(yLens, [ gte(__, constants.ROW_COUNT) ]);
// coord -> boolean
const isTopYOutOfBounds = coordValidator(yLens, [ lt(__, 0) ]);

// coord -> boolean, above board top does not count as out of bounds, can move piece freely at top.
export const isCoordOutOfBounds = anyPass([isXOutOfBounds, isBottomYOutOfBounds]);

// state -> boolean
export const isPieceOutOfBounds = compose(
	any(isCoordOutOfBounds),
	pieceActualPosition
);
// state -> coord -> boolean
export const isCoordOverlapping = (state) =>
	// ifElse(
	// 	anyPass([isTopYOutOfBounds, isCoordOutOfBounds]),
	// 	always(false),
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

// state -> boolean
export const isShiftValid = complement(anyPass([isPieceOutOfBounds, isPieceOverlapping]));
// (f, [validator]) -> state -> boolean, validates transformed state, returns true if valid
const isTransformValid = (transformFunc, validator) =>
    compose(
        validator,
        transformFunc
    );
// TRANSFORMERS
// directions used as transformers for shift function
const leftDir = over(xLens, dec);
const rightDir = over(xLens, inc);
const downDir = over(yLens, inc);
// rotation directions used as transformers for rotate functions
const clockwise = [compose(multiply(-1), last), head];
const counterClockwise = [last, compose(multiply(-1), head)];
/**
 * tries to transform state with transformFunc, returns transformed state if validated by validator
 * if invalid it returns result of running elseFunc with final arg (state)
 */
const tryTransformElse = curry((elseFunc, transformFunc, validator, state) =>
    ifElse(
        isTransformValid(transformFunc, validator),
        transformFunc,
        elseFunc
    )(state));
// (transform -> state) -> state
const tryTransform = tryTransformElse(identity);

// f -> state -> state, f is piece transformer (leftDir/rightDir)
const shift = over(posLens);
const rotatePiece = (dirFuncs) => map(
    converge(
        compose(
            normalizeCoord,
            Array.of
        ),
        dirFuncs
    )
);
// [f] -> state -> state, f is a pair of transformers, first applies to x coord, second to y coord
const rotate = dirFuncs => over(pieceCoordLens, rotatePiece(dirFuncs));

// (state, coord) -> state
const fillCell = (state, coord) => converge(
    set(cellLens( coord )),
    [view(pieceTokenLens), identity],
)(state);

// state -> state
export const writeToBoard = converge(
    reduce(fillCell),
    [identity, pieceActualPosition]
);

// state -> state, entry point for writing active piece to board and getting a new piece
export const lockPiece = compose(
    getNextPiece,
    set(posLens, constants.START_POS),
    writeToBoard
);

// state -> boolean
const isDownShiftInvalid = complement(isTransformValid(shift(downDir), isShiftValid));
// PUBLIC FUNCS
// state -> state
export const dropPiece =
	compose(
		lockPiece,
		until(
			isDownShiftInvalid,
			shift(downDir)
		)
	);

export const shiftLeft = tryTransform(shift(leftDir), isShiftValid);
export const shiftRight = tryTransform(shift(rightDir), isShiftValid);
export const shiftDown = tryTransformElse(lockPiece, shift(downDir), isShiftValid);
export const rotateClockwise = tryTransform(rotate(clockwise), isShiftValid);
export const rotateCounterClockwise = tryTransform(rotate(counterClockwise), isShiftValid);