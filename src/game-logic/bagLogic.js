import {
    compose, values, head, view, tail, set, ifElse, converge, identity, equals
} from "ramda";
import * as constants from './constants/index';
import shuffle from 'shuffle-array';
import { lens } from './helpers';

/**
 * Bag logic keeps manages the state of the "bag" of pieces. A bag consists of the seven possible
 * tetris pieces in random order as an array. The head of the array is the next piece to be played.
 * When the final piece is taken from the bag it makes a new bag. With this bag approach a piece can
 * at most go without being played for 14(?) pieces (I think?)
 */
const shuffleObjValues = compose(
    shuffle,
    values
);
export const getShuffledBag = () => shuffleObjValues(constants.PIECES);

export const nextPiece = compose(
    head,
    view(lens.bag)
);
const fromBag = (func) => compose(
    func,
    view(lens.bag)
);
const bagWillBeEmpty = compose(equals(1), view(lens.bagLength));

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
const setNextPiece = overProperty(lens.piece, bagHead);
// state -> state
const setBag = overProperty(lens.bag, getBagRest);
// state -> state
export const getNextPiece = compose(setBag, setNextPiece);
