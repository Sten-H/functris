import {
	compose, converge, curry, dec, head, inc, last, map, multiply, over, view, anyPass, ifElse, identity,
	set, reduce, complement, until
} from 'ramda';
import * as constants from './constants/index';
import * as board from './boardLogic';
import * as bag from "./bagLogic";
import { normalizeCoord, pieceCoordLens, posLens, xLens, yLens } from './helpers';

/**
 * Movement logic validates and executes valid shifts and rotations of pieces. As of right now it
 * also "locks" pieces meaning that it decides when to call writeToBoard which write piece to board
 * state, and it asks for next piece from bag. Not sure whose responsibility that should be.
 */
// state -> boolean
export const isShiftValid = complement(
	anyPass([
		board.isPieceOutOfBounds,
		board.isPieceOverlapping
	]));
// (f, [validator]) -> state -> boolean, validates transformed state, returns true if valid
export const isTransformValid = (transformFunc, validator) =>
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

// state -> state, entry point for writing active piece to board and getting a new piece
export const lockPiece = compose(
    bag.getNextPiece,
    set(posLens, constants.START_POS),
    board.writeToBoard
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