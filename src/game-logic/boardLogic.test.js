import {
	all, compose, concat, dec, equals, last, repeat, set, subtract, update, takeLast, reverse
} from 'ramda';
import * as c from './constants';
import { boardLens, pieceLens, posLens } from './helpers';
import * as b from './boardLogic';
import * as m from './movementLogic';

describe('Board logic', () => {
	const state = {
		board: c.EMPTY_BOARD,
		pos: [0 ,0],
		piece: c.PIECES.I,
		bag: [c.PIECES.L, c.PIECES.I]
	};
	describe('Out of bounds', () => {
		it('should detect x out of bounds', () => {
			expect(b.isCoordOutOfBounds([-1, 10])).toBe(true);
			expect(b.isCoordOutOfBounds([0, 5])).toBe(false);
			expect(b.isCoordOutOfBounds([9, 19])).toBe(false);
			expect(b.isCoordOutOfBounds([10, 7])).toBe(true);
		});
		it('should detect piece out of x bounds', () => {
			const s = set(posLens, [0, 0], state);
			expect(b.isPieceOutOfBounds(s)).toBe(true);
		});
		it('should detect piece out of lower y bounds', () => {
			const s = set(posLens, [5, 20], state);
			expect(b.isPieceOutOfBounds(s)).toBe(true);
		});
	});
	describe('General', () => {
		it('should have 20 rows and 10 columns', () => {
			expect(c.EMPTY_BOARD).toHaveLength(20);
			expect(c.EMPTY_ROW).toHaveLength(10);
		});
		it('Default state row values should be empty tokens', () => {
			expect(all(equals(c.EMPTY_TOKEN), c.EMPTY_ROW)).toBe(true);
		});
		it('should get cells with x y coords', () => {
			const filledRowBoard = update(dec(c.ROW_COUNT), c.FILLED_ROW, c.EMPTY_BOARD);
			const s = set(boardLens, filledRowBoard, state);
			const cell1 = b.getCell(s, [5, dec(c.ROW_COUNT)]); // get cell from filled bottom row
			const cell2 = b.getCell(s, [5, 5]);  // empty
			expect(cell1).toEqual(c.FILL_TOKEN);
			expect(cell2).toEqual(c.EMPTY_TOKEN);
		});
		it('should write piece to board', () => {
			const s = compose(
				set(posLens, [1, 19]),
				set(pieceLens, c.PIECES.I),  // laying down I piece, going 1 block to left 2 to right
				set(boardLens, c.EMPTY_BOARD)
			)(state);
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
			const board = update(dec(c.ROW_COUNT), c.FILLED_ROW, c.EMPTY_BOARD);
			const s = compose(
				set(posLens, [4,0]),
				set(pieceLens, c.PIECES.I),
				set(boardLens, board)
			)(state);
			// before clear last row should be filled
			expect(last(s.board)).not.toContain(c.EMPTY_TOKEN);
			// should now be cleared
			const stateAfterClear = b.clearLines(s);
			expect(last(stateAfterClear.board)).toEqual(c.EMPTY_ROW);
			expect(stateAfterClear.board.length).toEqual(20);
		});
		it('should clear multiple filled lines', () => {
			const board = compose(
				takeLast(20),
				reverse,
				concat(repeat(c.FILLED_ROW, 4))
			)(c.EMPTY_BOARD);
			const s = set(boardLens, board, state);
			const stateAfterClear = b.clearLines(s);
			takeLast(4, stateAfterClear.board).map(row => expect(row).toEqual(c.EMPTY_ROW));
		});
		it('should move remaining lines down', () => {
			const secondLast = concat(repeat(c.PIECES.O.token, 4), repeat(c.EMPTY_TOKEN, 6));
			const board = compose(
				update(dec(c.ROW_COUNT), c.FILLED_ROW),
				update(subtract(c.ROW_COUNT, 2), secondLast)
			)(c.EMPTY_BOARD);
			const s = compose(
				set(posLens, [4,0]),
				set(pieceLens, c.PIECES.I),
				set(boardLens, board)
			)(state);
			const stateAfterClear = b.clearLines(s);
			const lastRowAfterClear = last(stateAfterClear.board);
			expect(stateAfterClear.board.length).toEqual(20);
			expect(lastRowAfterClear).toEqual(secondLast);
		});
		it('should clear lines after piece drop', () => {
			const board = update(dec(c.ROW_COUNT), concat([c.EMPTY_TOKEN], repeat('X', 9)), c.EMPTY_BOARD);
			const s = compose(
				set(posLens, [0,0]),
				set(pieceLens, { coords: [[0, 0]], token: 'X'}),
				set(boardLens, board)  // Board final row has one empty cell (leftmost cell)
			)(state);
			const stateAfterDrop = m.dropPiece(s);
			expect(last(stateAfterDrop.board)).toEqual(c.EMPTY_ROW);
		});
	});
});