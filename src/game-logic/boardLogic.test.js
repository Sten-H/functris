import {
	all, compose, concat, dec, equals, last, repeat, set, subtract, update, takeLast, reverse
} from 'ramda';
import * as c from './constants';
import { getTestState, lens } from './helpers';
import * as b from './boardLogic';
import * as m from './movementLogic';

describe('Board tetris', () => {
	describe('Out of bounds', () => {
		it('should detect x out of bounds', () => {
			expect(b.isCoordOutOfBounds([-1, 10])).toBe(true);
			expect(b.isCoordOutOfBounds([0, 5])).toBe(false);
			expect(b.isCoordOutOfBounds([9, 19])).toBe(false);
			expect(b.isCoordOutOfBounds([10, 7])).toBe(true);
		});
		it('should detect piece out of x bounds', () => {
			const s = getTestState({pos: [0, 0]});
			expect(b.isPieceOutOfBounds(s)).toBe(true);
		});
		it('should detect piece out of lower y bounds', () => {
			const s = getTestState({pos: [5, c.ROW_COUNT]});
			expect(b.isPieceOutOfBounds(s)).toBe(true);
		});
	});
	describe('General', () => {
		it('should appropriate number of columns and rows', () => {
			expect(c.EMPTY_BOARD).toHaveLength(c.ROW_COUNT);
			expect(c.EMPTY_ROW).toHaveLength(c.COL_COUNT);
		});
		it('Default state row values should be empty tokens', () => {
			expect(all(equals(c.EMPTY_TOKEN), c.EMPTY_ROW)).toBe(true);
		});
		it('should get cells with x y coords', () => {
			const s = getTestState({board: [c.FILLED_ROW]});
			const cell1 = b.getCell(s, [5, dec(c.ROW_COUNT)]); // get cell from filled bottom row
			const cell2 = b.getCell(s, [5, 5]);  // empty
			expect(cell1).toEqual(c.FILL_TOKEN);
			expect(cell2).toEqual(c.EMPTY_TOKEN);
		});
		it('should write piece to board', () => {
			const s = getTestState({piece: c.PIECES.I, pos: [1, dec(c.ROW_COUNT)]});
			const expected = concat(repeat(c.PIECES.I.token, 4), repeat(c.EMPTY_TOKEN, 6));
			expect(last(b.writeToBoard(s).board)).toEqual(expected);
		});
	});
	describe('Line Clear', () => {
		it('should identify full row', () => {
			expect(b.isRowEmpty(c.EMPTY_ROW)).toBe(true);
			expect(b.isRowFull(c.EMPTY_ROW)).toBe(false);
			expect(b.isRowFull(c.FILLED_ROW)).toBe(true);
		});
		it('should clear filled line', () => {
			const s = getTestState({board: [c.FILLED_ROW]});
			// before clear last row should be filled
			expect(last(s.board)).not.toContain(c.EMPTY_TOKEN);
			// should now be cleared
			const stateAfterClear = b.clearLines(s);
			expect(last(stateAfterClear.board)).toEqual(c.EMPTY_ROW);
			expect(stateAfterClear.board.length).toEqual(c.ROW_COUNT);
		});
		it('should clear multiple filled lines', () => {
			const s = getTestState({board: repeat(c.FILLED_ROW, 4)});
			const stateAfterClear = b.clearLines(s);
			takeLast(4, stateAfterClear.board).map(row => expect(row).toEqual(c.EMPTY_ROW));
		});
		it('should move remaining lines down', () => {
			const lastRow = c.FILLED_ROW;
			const secondLastRow = concat(repeat(c.PIECES.O.token, 4), repeat(c.EMPTY_TOKEN, 6));
			const s = getTestState({board: [lastRow, secondLastRow]});
			const stateAfterClear = b.clearLines(s);
			const lastRowAfterClear = last(stateAfterClear.board);
			expect(stateAfterClear.board.length).toEqual(c.ROW_COUNT);
			expect(lastRowAfterClear).toEqual(secondLastRow);
		});
	});
	describe('Game over (top out)', () => {
		it('should recognize filled token in illegal rows', () => {
			const illegalRow = concat(repeat(c.FILL_TOKEN, 2), repeat(c.EMPTY_TOKEN, 8));
			const board = concat([illegalRow], repeat(c.EMPTY_ROW, 21));
			const s = getTestState({board});
			expect(b.isTopOut(s)).toBe(true);
		});
		it('should recognize filled token not in illegal rows', () => {
			const illegalRow = concat(repeat(c.FILL_TOKEN, 2), repeat(c.EMPTY_TOKEN, 8));
			const s = getTestState({board: [illegalRow]});
			expect(b.isTopOut(s)).toBe(false);
		});
		it('should not consider active piece in illegal rows', () => {
			const illegalRow = concat(repeat(c.FILL_TOKEN, 2), repeat(c.EMPTY_TOKEN, 8));
			const s = getTestState({board: [illegalRow], pos: [5,0], piece: c.PIECES.O});
			expect(b.isTopOut(s)).toBe(false);
		});
	});
});