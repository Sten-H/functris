import {
    add, any, compose, converge, curry, dec, equals, flip, head, inc, last, lensIndex, map, multiply,
    over, path, zipWith, reverse, __, when, gte, lt, view, or, not, lensProp, anyPass, ifElse, identity, lensPath,
    concat, set, reduce
} from "ramda";
import * as constants from './constants';
import { FILL_TOKEN, ROW_COUNT } from "./constants/index";
import { getNextPiece } from "./bagLogic";
// LENSES
// State lenses
export const posLens = lensProp('pos');
export const boardLens = lensProp('board');
export const pieceLens = lensProp('piece');
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
export const addCoords = zipWith(add);
// (board -> coord) -> str, cell value is string (token symbol)
export const getCell = curry((state, coord) => view(
    cellLens(coord),
    state));
//state -> piece, adds position value to each piece coord to get true position
export const pieceActualPosition = curry(({pos, piece}) => map(addCoords(pos), piece));
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
    equals(FILL_TOKEN),
    getCell(state)
);
// state -> boolean
export const isPieceOverlapping = state =>
    compose(
        any(isCoordOverlapping(state)),
        pieceActualPosition)(state);
// (lens, [predicates] -> f(coord) -> boolean
const coordValidator = (lens, predicates) =>
    compose(
        anyPass(predicates),
        view(lens)
    );
const isXOutOfBounds = coordValidator(
    xLens,
    [
        lt(__, 0),
        gte(__, constants.COL_COUNT)
    ]);
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
// f -> state -> boolean, validates transformed state, returns true if valid
const transformAndValidate = transformFunc =>
    compose(
        not,
        converge(
            or,
            [
                isPieceOutOfBounds,
                isPieceOverlapping
            ]
        ),
        transformFunc
    );
/**
 * tries to transform state with transformFunc, returns transformed state if valid
 * if invalid it returns result of running elseFunc with final arg (state)
 */
const tryTransformElse = curry((elseFunc, transformFunc, state) =>
    ifElse(
        transformAndValidate(transformFunc),
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
const rotate = dirFuncs => over(pieceLens, rotatePiece(dirFuncs));

// (state, coord) -> state
const fillCell = (state, coord) => set(cellLens( coord ), FILL_TOKEN, state);
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

// Public piece transformer functions
export const shiftLeft = tryTransform(shift(leftDir));
export const shiftRight = tryTransform(shift(rightDir));
export const shiftDown = tryTransformElse(lockPiece, shift(downDir));
export const rotateClockwise = tryTransform(rotate(clockwise));
export const rotateCounterClockwise = tryTransform(rotate(counterClockwise));
// const tryTransformElse = curry((elseFunc, transformFunc, state)