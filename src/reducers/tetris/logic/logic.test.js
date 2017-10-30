import {
    shiftLeft, shiftRight, rotateClockwise, rotateCounterClockwise, isPieceOverlapping,
    pieceActualPosition, isCoordOverlapping, getCell, isCoordOutOfBounds, isPieceOutOfBounds, posLens, boardLens,
    pieceLens, shiftDown, writeToBoard, lockPiece, bagLens
} from "./logic";
import {
    adjust, all, compose, concat, dec, equals, inc, last, over, prop, repeat, set, update, view
} from "ramda";
import { ROW_COUNT, EMPTY_BOARD, EMPTY_TOKEN, FILL_TOKEN, COL_COUNT, START_POS } from "./constants/index";
import { getShuffledBag, getpiece } from "./bagLogic";

describe('Tetris logic', () => {
    const emptyBoard = EMPTY_BOARD;
    const emptyRow = emptyBoard[0];
    const filledRow = repeat(FILL_TOKEN, ROW_COUNT);
    const LPiece = [ [ 1, -1], [-1,  0], [ 0,  0], [ 1,  0] ];  // L piece: -->  ___|
    const IPiece = [ [-1,  0], [0,  0], [ 1,  0], [ 2,  0] ];  // I piece --> ____
    const pos = [0 ,0];
    const state = {
        board: emptyBoard,
        pos: pos,
        piece: IPiece,
        bag: [LPiece, IPiece ]
    };
    describe('Out of bounds', () => {
        it('should detect x out of bounds', () => {
            expect(isCoordOutOfBounds([-1, 10])).toBe(true);
            expect(isCoordOutOfBounds([0, 5])).toBe(false);
            expect(isCoordOutOfBounds([9, 19])).toBe(false);
            expect(isCoordOutOfBounds([10, 7])).toBe(true);
        });
        it('should detect piece out of x bounds', () => {
            expect(isPieceOutOfBounds(state)).toBe(true);
            const s = set(posLens, [1, 0], state);
            expect(isPieceOutOfBounds(s)).toBe(false);
        });
        it('should detect piece out of lower y bounds', () => {
            const s = set(posLens, [5, 20], state);
            expect(isPieceOutOfBounds(s)).toBe(true);
        });
    });
    describe('Shift horizontal', () => {
        it('Should shift horizontally', () => {
            const s = set(posLens, [5, 5], state);
            const expected = [4, 5];
            expect(shiftLeft(s).pos).toEqual(expected);
        });
        it('Should return call value if piece out of bounds after shift', () => {
            const s1 = set(posLens, [0, 5], state);
            const expected1 = [0, 5];
            expect(shiftLeft(s1).pos).toEqual(expected1);
            const s2 = set(posLens, [7, 10], state);
            const expected2 = [7, 10];
            // Check to see that it is valid before move
            expect(isPieceOutOfBounds(s2)).toBe(false);
            // Stick will be out of bounds on right shift, should not move
            expect(shiftRight(s2).pos).toEqual(expected2)
        });
        it('Should return call value if piece overlapping after shift', () => {
            const row = update(0, FILL_TOKEN, repeat(EMPTY_TOKEN, COL_COUNT));
            const board = update(dec(ROW_COUNT), row, emptyBoard);
            const s = compose(
                set(pieceLens, [[0,0]]),
                set(boardLens, board),
                set(posLens, [1, dec(ROW_COUNT)])
            )(state);
            const expected = [1, 19];
            expect(shiftLeft(s).pos).toEqual(expected);
        })
    });
    describe('Shift vertical', () => {
       it('should shift vertically', () => {
           const s = set(posLens, [5, 5], state);
           const expected = [5, 6];
           expect(shiftDown(s).pos).toEqual(expected);
       });
        it('should write piece to board when shifted to overlap', () => {
            const s = compose(
                set(posLens, [1, 19]),
                set(pieceLens, IPiece),  // laying down I piece, going 1 block to left 2 to right
                set(boardLens, EMPTY_BOARD)
            )(state);
            const newState = shiftDown(s);
            const expected = concat(repeat(FILL_TOKEN, 4), repeat(EMPTY_TOKEN, 6));
            expect(last(newState.board)).toEqual(expected);
        })
    });
    describe('Rotate', () => {
        const s1 = compose(
            set(posLens, [5, 5]),
            set(pieceLens, LPiece)
        )(state);
        it('Should rotate clockwise', () => {
            const expected = [ [ 1,  1], [ 0, -1], [ 0,  0], [ 0,  1] ];
            expect(rotateClockwise(s1).piece).toEqual(expected);
        });
        it('Should rotate counter clockwise', () => {
            const expected = [ [-1, -1], [ 0,  1], [ 0,  0], [ 0, -1] ];
            expect(rotateCounterClockwise(s1).piece).toEqual(expected);
        });
        it('Rotate counter then clockwise should revert to original', () => {
            const expected = prop('piece')(s1);
            const rotated = compose(
                prop('piece'),
                rotateClockwise,
                rotateCounterClockwise
            )(s1);
            expect(rotated).toEqual(expected);
        });
        it('piece rotated counter should not be equal piece rotated clockwise (except OPiece)', () => {
            const s1 = compose(
                set(posLens, [5, 5]),
                set(pieceLens, LPiece)
            )(state);
            expect(rotateClockwise(s1).piece).not.toEqual(rotateCounterClockwise(s1).piece)
            const s2 = compose(
                set(posLens, [5, 5]),
                set(pieceLens, IPiece)
            )(state);
            expect(rotateClockwise(s2).piece).not.toEqual(rotateCounterClockwise(s2).piece)
        });
        it('Should return call value if piece out of x bounds after rotation', () => {
            const s = compose(
                rotateClockwise,
                set(posLens, [0, 5]),
            )(state);  // Stick piece is upright and on left border, will be out of bounds if rotated
            const expected = view(pieceLens, s);
            expect(rotateClockwise(s).piece).toEqual(expected);
        });
        it('Should return call value if piece out of lower y bound after rotation', () => {
            // FIXME this should probably later raise the piece instead of invalidating
            const s = compose(
                set(posLens, [0, 19]),
                set(pieceLens, IPiece), // laying down stick piece
            )(state);  // rotating will make stick go though floor
            const expected = view(pieceLens, s);
            expect(rotateCounterClockwise(s).piece).toEqual(expected);
        });
        it('Should return call value if piece overlapping after rotation', () => {
            const filledRowBoard = update(dec(ROW_COUNT), filledRow, emptyBoard);
            const s = compose(
                set(posLens, [0, 18]),
                set(pieceLens, IPiece),
                set(boardLens, filledRowBoard)
            )(state);
            // check to see that it doesn't overlap before rotation
            expect(isPieceOverlapping(s)).toBe(false);
            const expected = view(pieceLens, s);
            expect(rotateClockwise(s).piece).toEqual(expected);
            expect(rotateCounterClockwise(s).piece).toEqual(expected);
        });
    });
    describe('Board', () => {
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
            const s = set(boardLens, filledRowBoard, state);
            const cell1 = getCell(s, [5, dec(ROW_COUNT)]); // get cell from filled bottom row
            const cell2 = getCell(s, [5, 5]);  // empty
            expect(cell1).toEqual(FILL_TOKEN);
            expect(cell2).toEqual(EMPTY_TOKEN);
        });
        it('should write piece to board', () => {
            const s = compose(
                set(posLens, [1, 19]),
                set(pieceLens, IPiece),  // laying down I piece, going 1 block to left 2 to right
                set(boardLens, EMPTY_BOARD)
            )(state);
            const expected = concat(repeat(FILL_TOKEN, 4), repeat(EMPTY_TOKEN, 6));
            expect(last(writeToBoard(s).board)).toEqual(expected);
        });
        it('should reset position after piece written to board', () => {
            const s = compose(
                set(posLens, [1, 19]),
                set(pieceLens, IPiece),  // laying down I piece, going 1 block to left 2 to right
                set(boardLens, EMPTY_BOARD)
            )(state);
            expect(lockPiece(s).pos).toEqual(START_POS);
        });
        it('should get new piece after piece written to board', () => {
            const s = compose(
                set(posLens, [1, 19]),
                set(pieceLens, IPiece),  // laying down I piece, going 1 block to left 2 to right
                set(boardLens, EMPTY_BOARD),
                set(bagLens, [LPiece])
            )(state);
            expect(lockPiece(s).piece).toEqual(LPiece);
        });
    });
    describe('Overlap detection', () => {
        it('should detect overlap', () => {
            const board = update(dec(ROW_COUNT), filledRow, EMPTY_BOARD);  // Bottom row filled
            const s1 = compose(
                set(posLens, [5, dec(ROW_COUNT)]),  // Bottom middle
                set(boardLens, board)
            )(state);
            // IPiece is laying down should overlap
            expect(isPieceOverlapping(s1)).toBe(true);
            // Raise pos by 1, should no longer overlap
            const s2 = over(posLens, adjust(inc, 1), state);
            expect(isPieceOverlapping(s2)).toBe(false);
        });
    });
});