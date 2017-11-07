import { getShuffledBag, getNextPiece, nextPiece } from "./bagLogic";
import { takeLast } from "ramda";
import * as c from './constants';
import { getTestState, lens } from './helpers';

describe('Seven Bag tetris', () => {
    it('should return list of seven pieces (in random order)', () => {
        const bag = getShuffledBag();
        expect(bag).toHaveLength(7);
        expect(takeLast(bag).length).toBeGreaterThanOrEqual(1);
    });
    it('should get piece from bag and set to active piece', () => {
        const s = getTestState({bag: [ c.PIECES.L ], piece: c.PIECES.J});
        const expected = c.PIECES.L;
        expect(getNextPiece(s).piece).toEqual(expected);
    });
    it('should replenish bag if bag is empty after get', () => {
	    const s = getTestState({bag: [ c.PIECES.L ], piece: c.PIECES.J});
        expect(getNextPiece(s).bag).toHaveLength(7);
    });
});