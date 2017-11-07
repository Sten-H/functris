import {
	compose, values, head, view, tail, set, ifElse, converge, identity, equals, over, length
} from 'ramda';
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

// bag ->boolean
const bagWillBeEmpty = compose(equals(1), length);

// bag -> bag
const getBagRest = ifElse(
    bagWillBeEmpty,
    getShuffledBag,
    tail
);
// state -> state
const setNextPiece = converge(
	set(lens.piece),
	[compose(head, view(lens.bag)), identity]
);

// state -> state
const setBag = over(lens.bag, getBagRest);

// state -> state
export const getNextPiece = compose(setBag, setNextPiece);