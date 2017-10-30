import {
    __, always, apply, compose, curry, values, lensProp, map, pipe, prop, repeat, head, view, over, tail, set, isEmpty,
    ifElse, converge, identity, equals, length, lensPath
} from "ramda";
import { rotateClockwise } from "./logic";
import * as constants from './constants';
import shuffle from 'shuffle-array';

const pieceLens = lensProp('piece');
const bagLens = lensProp('bag');
const bagLengthLens = lensPath(['bag', 'length']);

const shuffleObjValues = compose(
    shuffle,
    values
);
export const getShuffledBag = () => shuffleObjValues(constants.PIECES);

export const nextPiece = compose(
    head,
    view(bagLens)
);
const fromBag = (func) => compose(
    func,
    view(bagLens)
);
const bagWillBeEmpty = compose(equals(1), view(bagLengthLens));

const bagHead = fromBag(head);
const bagTail = fromBag(tail);
const getBagRest = ifElse(
    bagWillBeEmpty,
    getShuffledBag,
    bagTail
);
// basically "over" but it uses and returns whole state as argument, not only lens part
const overProperty = (lens, func) => converge(
    set(lens),
        [func, identity]
    );
// state -> state
const setNextPiece = overProperty(pieceLens, bagHead);
// state -> state
const setBag = overProperty(bagLens, getBagRest);
// state -> state
export const getNextPiece = compose(setBag, setNextPiece);
