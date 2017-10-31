import {
    compose, values, lensProp, head, view, tail, set, ifElse, converge, identity, equals, lensPath
} from "ramda";
import * as constants from './constants';
import shuffle from 'shuffle-array';

/**
 * Bag logic keeps manages the state of the "bag" of pieces. A bag consists of the seven possible
 * tetris pieces in random order as an array. The head of the array is the next piece to be played.
 * When the final piece is taken from the bag it makes a new bag. With this bag approach a piece can
 * at most go without being played for
 */

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
