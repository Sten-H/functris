import {
    add, any, compose, converge, curry, dec, equals, head, inc, last, lensIndex, map, multiply,
    over, zipWith, reverse, __, when, gte, lt, view, or, not, lensProp, anyPass, ifElse, identity, lensPath,
    concat, set, reduce, always, complement
} from "ramda";
import * as constants from './constants';
import { EMPTY_TOKEN, FILL_TOKEN, ROW_COUNT } from "./constants/index";
import { getNextPiece } from "./bagLogic";

/**
 * Main logic of tetris game.
 */
// LENSES
// State lenses
export const posLens = lensProp('pos');
export const boardLens = lensProp('board');
export const pieceLens = lensProp('piece');
export const coordLens = lensProp('coords');
export const pieceCoordPath = lensPath(['piece', 'coords']);
export const pieceTokenPath = lensPath(['piece', 'token']);
export const bagLens = lensProp('bag');
// cell lens from state (ex: ['board', [0, 1]). coord is reversed because board is [y, x] oriented
export const cellLens = compose(lensPath,
    concat(['board']),
    reverse);
// Coord lenses
const xLens = lensIndex(0);
const yLens = lensIndex(1);

// GENERAL HELPER FUNCTIONS
// n -> n, transforms -0 to 0
const normalizeZero = when(equals(-0), Math.abs);
// c -> c Sets all -0 to 0 in coord.
const normalizeCoord = map(normalizeZero);
// c -> c -> c
const addCoords = zipWith(add);
// (board -> coord) -> str, cell value is string (token symbol)
export const getCell = curry((state, coord) => view(
    cellLens(coord),
    state));
// state -> piece, adds position value to each piece coord to get true position
export const pieceActualPosition = converge(
    map,
    [compose(addCoords, view(posLens)), view(pieceCoordPath)]
);
const isCellEmpty = equals(EMPTY_TOKEN);
const isCellFilled = complement(isCellEmpty);
// TRANSFORMERS
// directions used as transformers for shift function
const leftDir = over(xLens, dec);
const rightDir = over(xLens, inc);
const downDir = over(yLens, inc);
// rotation directions used as transformers for rotate functions
const clockwise = [compose(multiply(-1), last), head];
const counterClockwise = [last, compose(multiply(-1), head)];

// VALIDATORS
// state -> coord -> boolean
export const isCoordOverlapping = (state) => compose(
    isCellFilled,
    getCell(state)
);
// state -> boolean
export const isPieceOverlapping =
    converge(
        any,
        [isCoordOverlapping, pieceActualPosition]
    );

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
const isYOutOfBounds = coordValidator(
    yLens,
    [
        gte(__, ROW_COUNT)
    ]);
// coord -> boolean
export const isCoordOutOfBounds = anyPass([isXOutOfBounds, isYOutOfBounds]);
// (pos -> piece) -> boolean
export const isPieceOutOfBounds = curry((state) => compose(
    any(isCoordOutOfBounds),
    pieceActualPosition)(state));
// state -> boolean
export const isShiftValid = complement(anyPass([isPieceOutOfBounds, isPieceOverlapping]));
// (f, [validator]) -> state -> boolean, validates transformed state, returns true if valid
const isTransformValid = (transformFunc, validator)=>
    compose(
        validator,
        transformFunc
    );
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
const rotate = dirFuncs => over(pieceCoordPath, rotatePiece(dirFuncs));

// (state, coord) -> state
const fillCell = (state, coord) => converge(
    set(cellLens( coord )),
    [view(pieceTokenPath), identity],
)(state);
// state -> state
export const writeToBoard = converge(
    reduce(fillCell),
    [identity, pieceActualPosition]
);
// PUBLIC FUNCTIONS
export const lockPiece = compose(
    getNextPiece,
    set(posLens, constants.START_POS),
    writeToBoard
);

// PUBLIC FUNCS
export const shiftLeft = tryTransform(shift(leftDir), isShiftValid);
export const shiftRight = tryTransform(shift(rightDir), isShiftValid);
export const shiftDown = tryTransformElse(lockPiece, shift(downDir), isShiftValid);
export const dropPiece = identity;
export const rotateClockwise = tryTransform(rotate(clockwise), isShiftValid);
export const rotateCounterClockwise = tryTransform(rotate(counterClockwise), isShiftValid);