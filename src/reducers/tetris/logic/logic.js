import {
    add, any, compose, converge, curry, dec, equals, flip, head, identity, ifElse, inc, last, lensIndex, map, multiply,
    over, path, zipWith, reverse, __, always, cond, and, when, gte, lt, view, or, not, lensProp
} from "ramda";
import * as constants from './constants';
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

const shift = curry((dirFunc, state) => over(posLens, dirFunc, state));
const leftDir = over(xLens, dec);
const rightDir = over(xLens, inc);
/**
 * Shifts position
 */
// coord -> boolean
export const isCoordOutOfBounds = compose(
    converge(or, [lt(__, 0), gte(__, constants.COL_COUNT)]),
    view(xLens)
);
// (pos -> piece) -> boolean
export const isPieceOutOfBounds = curry(({pos, piece}) => compose(
    any(isCoordOutOfBounds),
    pieceActualPosition(pos)
)(piece));
//

const shiftHorizontal = curry((shiftFunc, state) =>
    ifElse(
        compose(
            not,
            converge(or,
                [
                    isPieceOutOfBounds,
                    isPieceOverlapping
                ]),
            shiftFunc
        ),
        shiftFunc,
        always(state),
    )(state));
export const shiftLeft = shiftHorizontal(shift(leftDir));
export const shiftRight = shiftHorizontal(shift(rightDir));

// PIECE FUNCTIONS
// n -> n, transforms -0 to 0
const normalizeZero = cond([
    [equals(-0), Math.abs],
    [always(true), identity]
]);
// adds position value to each piece coord to get true position
export const pieceActualPosition = curry((pos, piece) => map(addCoords(pos), piece));
// board -> coord -> boolean
export const isCoordOverlapping = board => compose(
    equals("X"),
    getCell(board));
export const isPieceOverlapping = curry(({pos, piece, board}) => {
    const actualPiece = pieceActualPosition(pos, piece);
    return any(isCoordOverlapping(board), actualPiece)
});
/**
 * Sets all -0 to 0 to make testing easier.
 */
const normalizeCoord = map(normalizeZero);
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
export const rotatePieceClockwise = map(rotateCoord(clockwise));
export const rotatePieceCounter = map(rotateCoord(counterClockwise));