import { __, always, apply, compose, curry, flip, lensProp, pipe, prop, repeat, set } from "ramda";
import { rotateClockwise } from "./logic";
import * as constants from './constants';

const pieceLens = lensProp('piece');
// Returns a random integer between min (included) and max (included)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getTimes = always(getRandomInt(1, 16));

// This state is only used as argument for rotate function
const mockState = {board: [], pos: [5, 5], piece: null};
// state -> state
const rotateN = curry((times, state) => compose(apply(pipe), repeat(rotateClockwise))(state)(times));
// state -> piece
export const spinPieceRandom = compose(
    prop('piece'),
    rotateN(__, getTimes())
);
export const getpiece = () => {
    const choosePiece = constants.PIECES.L;  // FIXME
    const state = set(pieceLens, choosePiece, mockState);
    return spinPieceRandom(state);
};
export const getBag = () => {
};