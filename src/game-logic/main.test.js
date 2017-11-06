import { concat, dec, last, repeat } from 'ramda';
import * as c from './constants/index';
import { getTestState } from './helpers';
import tetris, { isIllegalState, lockPiece } from './main';

describe('Main unit tests', () => {
	describe('Lock piece', () => {
		it('should reset position after piece written to board', () => {
			const s = getTestState({pos: [1, dec(c.ROW_COUNT)], piece: c.PIECES.I});
			expect(lockPiece(s).pos).toEqual(c.START_POS);
		});
		it('should get new piece after piece written to board', () => {
			const s = getTestState({pos: [1, dec(c.ROW_COUNT)], piece: c.PIECES. I, bag: [c.PIECES.L]});
			expect(lockPiece(s).piece).toEqual(c.PIECES.L);
		});
	});
	describe('Should identify illegal state', () => {
		const board = repeat(c.FILLED_ROW, c.ROW_COUNT);
		const s = getTestState({board, pos: [4, 6], piece: c.PIECES.O });
		expect(isIllegalState(s)).toBe(true);
	});
});
// NOTE consider that full rows will be cleared on almost all tetris.* functions. Can trip you up.
describe('Integration tests', () => {
	it('should clear lines after piece drop', () => {
		const lastRow = [concat([c.EMPTY_TOKEN], repeat(c.FILL_TOKEN, 9))];
		const s = getTestState({ board: lastRow, pos: [0,0],
			piece: { coords: [ [ 0, 0 ] ], token: c.FILL_TOKEN } });
		const stateAfterDrop = tetris.dropPiece(s);
		expect(last(stateAfterDrop.board)).toEqual(c.EMPTY_ROW);
	});
	it('should write piece to board when shifted to overlap', () => {
		const s = getTestState({pos: [1, dec(c.ROW_COUNT)], piece: c.PIECES.I});
		const newState = tetris.shiftDown(s);
		const expected = concat(repeat(c.PIECES.I.token, 4), repeat(c.EMPTY_TOKEN, 6));
		expect(last(newState.board)).toEqual(expected);
	});
	it('should detect illegal state after piece lock', () => {
		// messyRow will not get cleared
		const messyRow = concat(repeat(c.FILL_TOKEN, dec(c.COL_COUNT)), [c.EMPTY_TOKEN]);
		const board = repeat(messyRow, c.LEGAL_ROWS);
		const s = getTestState({ board: board, pos: [4,2], piece: c.PIECES.O });
		expect(isIllegalState(s)).toBe(false);
		const stateAfterDrop = tetris.dropPiece(s);
		console.log(stateAfterDrop.board);
		expect(isIllegalState(stateAfterDrop)).toBe(true);
	})
});