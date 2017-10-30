import {
    __, always, apply, compose, curry, values, lensProp, map, pipe, prop, repeat, head, view, over, tail, set, isEmpty
} from "ramda";
import { rotateClockwise } from "./logic";
import * as constants from './constants';
import shuffle from 'shuffle-array';

const pieceLens = lensProp('piece');
const bagLens = lensProp('bag');
// Returns a random integer between min (included) and max (included)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getTimes = always(getRandomInt(1, 16));

// This state is only used as argument for rotate function
const mockState = {board: [], pos: [5, 5], piece: null};
// state -> state
const rotateN = curry((times, state) => compose(apply(pipe), repeat(rotateClockwise))(state)(times));
// state -> piece
const spinPieceRandom = compose(
    prop('piece'),
    rotateN(__, getTimes())
);
// FIXME actually just hit me, I think pieces are always same rotation on spawn, look it up
const shuffleObjValues = compose(
    shuffle,
    values
);
/**
 * Returns an array of pieces (as array of coords, no additional info such as shape descriptor ('J').
 * @param {obj} key value pair with pieces ( { p: [piece] } )
 * @return {Array[]} returns array of pieces (which are arrays of coords)
 * @type {Function}
 */
export const getBag = () => shuffleObjValues(constants.PIECES);

export const nextPiece = compose(
    head,
    view(bagLens)
);
const fromBag = (func) => compose(
    func,
    view(bagLens)
);
const bagHead = fromBag(head);
const bagTail = fromBag(tail);

// FIXME refactor and rewrite this to be nicer
export const getNextPiece = (state) => {
    const nextPiece = bagHead(state);
    let newBag = bagTail(state);
    if(isEmpty(newBag)) {
        newBag = getBag();
    }
    return compose(
        set(bagLens, newBag),
        set(pieceLens, nextPiece)
    )(state);
};