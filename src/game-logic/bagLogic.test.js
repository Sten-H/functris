import { getShuffledBag, getNextPiece, nextPiece } from "./bagLogic";
import { compose, lensProp, set, takeLast, values } from "ramda";
import * as c from './constants';
import { bagLens, pieceLens } from './helpers';

const state = {
        board: c.EMPTY_BOARD,
        pos: [5, 5],
        piece: c.PIECES.I,
        bag: [ c.PIECES.L ]
};
describe('Seven Bag logic', () => {
    it('should return list of seven pieces (in random order)', () => {
        const bag = getShuffledBag();
        expect(bag).toHaveLength(7);
        expect(takeLast(bag).length).toBeGreaterThanOrEqual(1);
    });
    it('should get piece from bag and set to active piece', () => {
        const s = compose(
            set(bagLens, [ c.PIECES.L ]),
            set(pieceLens, [ c.PIECES.J ])
        )(state);
        const expected = c.PIECES.L;
        expect(getNextPiece(s).piece).toEqual(expected);
    });
    it('should replenish bag if bag is empty after get', () => {
        const s = compose(
            set(bagLens, [ c.PIECES.L ]),
            set(pieceLens, [ c.PIECES.J ])
        )(state);
        expect(getNextPiece(s).bag).toHaveLength(7);
    });
});