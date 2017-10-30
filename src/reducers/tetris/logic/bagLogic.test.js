import { getBag, getNextPiece, nextPiece } from "./bagLogic";
import { compose, lensProp, set, takeLast, values } from "ramda";
import { EMPTY_BOARD } from "./constants/index";
import * as constants from './constants';

const bagLens = lensProp('bag');
const pieceLens = lensProp('piece');
const state = {
        board: EMPTY_BOARD,
        pos: [5, 5],
        piece: constants.PIECES.IPiece,
        bag: [ constants.PIECES.LPiece ]
};
describe('Seven Bag logic', () => {
    it('should return list of seven pieces (in random order)', () => {
        const bag = getBag();
        expect(bag).toHaveLength(7);
        expect(takeLast(bag).length).toBeGreaterThanOrEqual(1);
    });
    it('should get piece from bag and set to active piece', () => {
        const s = compose(
            set(bagLens, [ constants.PIECES.L ]),
            set(pieceLens, [ constants.PIECES.J ])
        )(state);
        const expected = constants.PIECES.L;
        expect(getNextPiece(s).piece).toEqual(expected);
    });
    it('should replenish bag if bag is empty after get', () => {
        const s = compose(
            set(bagLens, [ constants.PIECES.L ]),
            set(pieceLens, [ constants.PIECES.J ])
        )(state);
        expect(getNextPiece(s).bag).toHaveLength(7);
    })
});