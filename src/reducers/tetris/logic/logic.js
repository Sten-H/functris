import {
    add, any, compose, converge, curry, dec, equals, flip, head, identity, ifElse, inc, last, lensIndex, map, multiply,
    over, path, zipWith, reverse, __, always, cond, and, when, gte, lt, view, or, not, lensProp, allPass, anyPass
} from "ramda";
import * as constants from './constants';
import { ROW_COUNT } from "./constants/index";
// LENSES
// State lenses
export const posLens = lensProp('pos');
export const boardLens = lensProp('board');
export const pieceLens = lensProp('piece');
// Coord lenses
const xLens = lensIndex(0);
const yLens = lensIndex(1);

// GENERAL FUNCTIONS
// c -> c -> c
export const addCoords = zipWith(add);
// BOARD FUNCTIONS
export const getCell = curry((board, coord) => compose(
    flip(path)(board),
    reverse)(coord));

// POSITION FUNCTIONS
// directions are used as transformers for shift function
const leftDir = over(xLens, dec);
const rightDir = over(xLens, inc);
// f -> state -> state, takes transformer (leftDir/rightDir), and state as arguments
const shift = over(posLens);

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
        gte(__, 20)
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
 * tries to transform state with transformer func, returns updated state if new state
 * is valid, otherwise returns old state.
 */
const tryTransform = curry((transformFunc, state) =>
    when(
        transformAndValidate(transformFunc),
        transformFunc,
    )(state));

export const shiftLeft = tryTransform(shift(leftDir));
export const shiftRight = tryTransform(shift(rightDir));

// PIECE FUNCTIONS
// n -> n, transforms -0 to 0
const normalizeZero = when(equals(-0), Math.abs);
// c -> c Sets all -0 to 0 in coord.
const normalizeCoord = map(normalizeZero);

// adds position value to each piece coord to get true position
export const pieceActualPosition = curry(({pos, piece}) => map(addCoords(pos), piece));

// state -> coord -> boolean
export const isCoordOverlapping = ({board}) => compose(
    equals("X"),
    getCell(board));

// state -> boolean
export const isPieceOverlapping = state =>
    compose(
        any(isCoordOverlapping(state)),
        pieceActualPosition)(state);

const clockwise = [compose(multiply(-1), last), head];
const counterClockwise = [last, compose(multiply(-1), head)];
/**
 * Takes a direction in the form of a list of transformers for coordinates [func1, func2]
 * and then takes coordinate array as final argument
 */
const rotateCoord = converge(
    compose(
        normalizeCoord,
        Array.of
    )
);
const rotatePiece = (dirFunc) => over(pieceLens, map(rotateCoord(dirFunc)));
export const rotateClockwise = tryTransform(rotatePiece(clockwise));
export const rotateCounterClockwise = tryTransform(rotatePiece(counterClockwise));