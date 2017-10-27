// Piece functions
import { compose, converge, equals, head, identity, ifElse, last, map, multiply } from "ramda";
import { handleActions } from "redux-actions";
import { PIECES } from '../constants';

const isZero = compose(
    equals(0),
    Math.abs
);
const normalizeZero = ifElse(
    isZero,
    Math.abs,
    identity
);
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

const defaultState = PIECES.L;
export const reducer = handleActions({}, defaultState);
export default reducer;