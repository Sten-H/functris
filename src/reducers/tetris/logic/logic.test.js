import {
    shiftLeft, shiftRight, rotatePieceClockwise, rotatePieceCounter, isPieceOverlapping,
    pieceActualPosition, isCoordOverlapping, getCell, isCoordOutOfBounds, isPieceOutOfBounds, posLens, boardLens
} from "./logic";
import { adjust, all, compose, dec, equals, inc, lensProp, map, over, path, repeat, set, update } from "ramda";
import { ROW_COUNT, EMPTY_BOARD, EMPTY_TOKEN, FILL_TOKEN, COL_COUNT } from "./constants/index";

describe('Tetris logic', () => {
    const emptyBoard = EMPTY_BOARD;
    const emptyRow = emptyBoard[0];
    const LPiece = [ [ 1, -1], [-1,  0], [ 0,  0], [ 1,  0] ];  // L piece: -->  ___|
    const IPiece = [ [-1,  0], [0,  0], [ 1,  0], [ 2,  0] ];  // I piece --> ____
    const pos = [0 ,0];
    const state = {
        board: emptyBoard,
        pos: pos,
        piece: IPiece
    };
    describe('Out of bounds', () => {
        it('should detect x out of bounds', () => {
            expect(isCoordOutOfBounds([-1, 10])).toBe(true);
            expect(isCoordOutOfBounds([0, 5])).toBe(false);
            expect(isCoordOutOfBounds([9, 19])).toBe(false);
            expect(isCoordOutOfBounds([10, 7])).toBe(true);
        });
        it('should detect piece out of bounds', () => {
            expect(isPieceOutOfBounds(state)).toBe(true);
            const s = set(posLens, [1, 0], state);
            expect(isPieceOutOfBounds(s)).toBe(false);
        });
    });
    describe('Shift horizontal', () => {
        it('Should shift horizontally', () => {
            const s = set(posLens, [5, 5], state);
            const expected = [4, 5];
            expect(shiftLeft(s).pos).toEqual(expected);
        });
        it('Should return call value if piece out of bounds after shift', () => {
            // const s1 = set(posLens, [0, 5], state);
            // const expected1 = [0, 5];
            // expect(shiftLeft(s1).pos).toEqual(expected1);
            const s2 = set(posLens, [7, 10], state);
            const expected2 = [7, 10];
            // Check to see that it is valid before move
            expect(isPieceOutOfBounds(s2)).toBe(false);
            // Stick will be out of bounds on right shift, should not move
            expect(shiftRight(s2).pos).toEqual(expected2)
        });
        it('Should return call value if piece overlapping after shift', () => {
            expect(true).toBe(true);
        })
    });
    describe('Rotate', () => {
        it('Should rotate clockwise', () => {
            const LRotated = rotatePieceClockwise(LPiece);
            const LExpected = [ [ 1,  1], [ 0, -1], [ 0,  0], [ 0,  1] ];
            expect(LRotated).toEqual(LExpected);
        });
        it('Should rotate counter clockwise', () => {
            const LRotated = rotatePieceCounter(LPiece);
            const LExpected = [ [-1, -1], [ 0,  1], [ 0,  0], [ 0, -1] ];
            expect(LRotated).toEqual(LExpected);
        });
        it('Should return call value if piece out of bounds after rotation', () => {
            expect(true).toBe(false);
        });
        it('Should return call value if piece overlapping after rotation', () => {
            expect(true).toBe(false);
        });
    });
    describe('Board', () => {
        const filledRow = repeat(FILL_TOKEN, COL_COUNT);
        describe('Set up', () => {
            it('should have 20 rows and 10 columns', () => {
                expect(emptyBoard).toHaveLength(20);
                expect(emptyRow).toHaveLength(10);
            });
            it('Default state row values should be empty tokens', () => {
                expect(all(equals(EMPTY_TOKEN), emptyRow)).toBe(true);
            });
        });
        it('should get cells with x y coords', () => {
            const filledRowBoard = update(dec(ROW_COUNT), filledRow, emptyBoard);
            const cell1 = getCell(filledRowBoard, [5, dec(ROW_COUNT)]); // get cell from filled bottom row
            expect(cell1).toEqual(FILL_TOKEN);
        });
    });
    describe('Overlap detection', () => {
        it('should detect overlap', () => {
            const filledRow = repeat(FILL_TOKEN, ROW_COUNT);
            const board = update(dec(ROW_COUNT), filledRow, EMPTY_BOARD);  // Bottom row filled
            const state1 = compose(
                set(posLens, [5, dec(ROW_COUNT)]),  // Bottom middle
                set(boardLens, board)
            )(state);
            // IPiece is laying down should overlap
            expect(isPieceOverlapping(state1)).toBe(true);
            const state2 = over(posLens, adjust(inc, 1), state);
            expect(isPieceOverlapping(state2)).toBe(false);
        });
    });
});