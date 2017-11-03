import {
	shiftLeft, shiftRight, rotateClockwise, rotateCounterClockwise,
	shiftDown, lockPiece, dropPiece,
} from './movementLogic';
import {
	all, compose, concat, countBy, dec, equals, last, isNil, prop, repeat, set, subtract,
	update, view, identity, always, ifElse, head, path
} from 'ramda';
import { ROW_COUNT, EMPTY_BOARD, EMPTY_TOKEN, FILL_TOKEN, COL_COUNT, START_POS, SHADOW_TOKEN } from './constants/index';
import * as c from './constants/index';
import { bagLens, boardLens, pieceCoordLens, pieceLens, posLens } from './helpers';
import * as b from './boardLogic';
const tokensInRow = (token, row) => compose(
    ifElse(
        isNil,
        always(0),
        identity
    ),
    prop('true'),
    countBy(equals(token)),
)(row);
describe('Tetris logic', () => {
    const emptyBoard = EMPTY_BOARD;
    const emptyRow = head(EMPTY_BOARD);
    const filledRow = repeat(FILL_TOKEN, ROW_COUNT);
    const LPiece = c.PIECES.L;  // L piece: -->  ___|
    const IPiece = c.PIECES.I;  // I piece --> ____
    const pos = [0 ,0];
    const state = {
        board: emptyBoard,
        pos: pos,
        piece: c.PIECES.I,
        bag: [LPiece, IPiece ]
    };
    describe('Board logic', () => {
	    describe('Out of bounds', () => {
		    it('should detect x out of bounds', () => {
			    expect(b.isCoordOutOfBounds([-1, 10])).toBe(true);
			    expect(b.isCoordOutOfBounds([0, 5])).toBe(false);
			    expect(b.isCoordOutOfBounds([9, 19])).toBe(false);
			    expect(b.isCoordOutOfBounds([10, 7])).toBe(true);
		    });
		    it('should detect piece out of x bounds', () => {
			    // expect(isPieceOutOfBounds(state)).toBe(true);
			    const s = set(posLens, [0, 0], state);
			    expect(b.isPieceOutOfBounds(s)).toBe(true);
		    });
		    it('should detect piece out of lower y bounds', () => {
			    const s = set(posLens, [5, 20], state);
			    expect(b.isPieceOutOfBounds(s)).toBe(true);
		    });
	    });
    });
    describe('Shift piece', () => {
        describe('Horizontal', () => {
            it('should shift horizontally', () => {
                const s = set(posLens, [5, 5], state);
                const expected = [4, 5];
                expect(shiftLeft(s).pos).toEqual(expected);
            });
            it('should return call value when piece out of bounds after shift', () => {
                const s1 = set(posLens, [0, 5], state);
                const expected1 = [0, 5];
                expect(shiftLeft(s1).pos).toEqual(expected1);
                const s2 = set(posLens, [7, 10], state);
                const expected2 = [7, 10];
                // Check to see that it is valid before move
                expect(b.isPieceOutOfBounds(s2)).toBe(false);
                // Stick will be out of bounds on right shift, should not move
                expect(shiftRight(s2).pos).toEqual(expected2)
            });
            it('should shift piece that is partly outside of top y bounds (top of screen)', () => {
                const startPos = [4, 0];
                const s = compose(
                    set(posLens, startPos),
                    set(pieceLens, LPiece)  // Top of L outside y top border
                )(state);

                expect(shiftRight(s).pos).not.toEqual(startPos);
            });
            it('should return call value when  piece overlapping after shift', () => {
                const row = update(0, FILL_TOKEN, repeat(EMPTY_TOKEN, COL_COUNT));
                const board = update(dec(ROW_COUNT), row, emptyBoard);
                const s = compose(
                    set(pieceLens, { coords: [ [ 0, 0 ] ], token: "I" } ),
                    set(boardLens, board),
                    set(posLens, [1, dec(ROW_COUNT)])
                )(state);
                const expected = [1, 19];
                expect(shiftLeft(s).pos).toEqual(expected);
            });
        });
        describe('Vertical', () => {
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
                const expected = concat(repeat(c.PIECES.I.token, 4), repeat(EMPTY_TOKEN, 6));
                expect(last(newState.board)).toEqual(expected);
            })
        });
        describe('Drop piece', () => {
            it('should drop piece to empty bottom row', () => {
                const s = compose(
                    set(posLens, [4,0]),
                    set(pieceLens, IPiece)
                )(state);
                // expect bottom row to contain filled cells after drop
	            const lastRowAfterDrop = path(['board', dec(ROW_COUNT)], dropPiece(s));
                expect(lastRowAfterDrop).toContain(IPiece.token);
	            const filledCellCount = tokensInRow(IPiece.token, lastRowAfterDrop);
	            const expected = 4; // length of IPiece lying down
	            expect(filledCellCount).toEqual(expected);
            });
            it('should drop piece to first encountered filled block', () => {
                const bottomRow = concat(repeat(EMPTY_TOKEN, 4), repeat(FILL_TOKEN, 1), repeat(EMPTY_TOKEN, 5));
                const board = update(dec(ROW_COUNT), bottomRow, emptyBoard);
                // board has one block in bottom middle
                const s = compose(
                    set(posLens, [4,0]),
                    set(pieceLens, IPiece),
                    set(boardLens, board)
                )(state);
                const stateAfterDrop = dropPiece(s);
                // Expect second to last row to now contain filled cell
                const secondLastRow = path(['board', subtract(ROW_COUNT, 2)], stateAfterDrop);
                const filledCellCount = tokensInRow(IPiece.token, secondLastRow);
                const expected = 4; // length of IPiece lying down
                expect(filledCellCount).toEqual(expected);
            });
        });
    });
    describe('Rotate', () => {
        const s1 = compose(
            set(posLens, [5, 5]),
            set(pieceLens, LPiece)
        )(state);
        it('should rotate clockwise', () => {
            const expected = { coords: [ [ 1,  1], [ 0, -1], [ 0,  0], [ 0,  1] ], token: "L"};
            expect(rotateClockwise(s1).piece).toEqual(expected);
        });
        it('should rotate counter clockwise', () => {
            const expected = { coords: [ [-1, -1], [ 0,  1], [ 0,  0], [ 0, -1] ], token: "L"};
            expect(rotateCounterClockwise(s1).piece).toEqual(expected);
        });
        it('rotate counter then clockwise should revert to original', () => {
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
            expect(rotateClockwise(s1).piece).not.toEqual(rotateCounterClockwise(s1).piece);
            const s2 = compose(
                set(posLens, [5, 5]),
                set(pieceLens, IPiece)
            )(state);
            expect(rotateClockwise(s2).piece).not.toEqual(rotateCounterClockwise(s2).piece);
        });
        it('should return call value if piece out of x bounds after rotation', () => {
            const s = compose(
                rotateClockwise,
                set(posLens, [0, 5]),
            )(state);  // Stick piece is upright and on left border, will be out of bounds if rotated
            const expected = view(pieceLens, s);
            expect(rotateClockwise(s).piece).toEqual(expected);
        });
        it('should rotate piece, even if it it is out of bounds after rotation', () => {
	        const s = compose(
		        set(posLens, [4, 0]),
		        set(pieceLens, LPiece)  // Top of L outside y top border
	        )(state);
            expect(rotateClockwise(s).piece.coords).not.toEqual(LPiece.coords);
        });
        it('should return call value if piece out of lower y bound after rotation', () => {
            // FIXME this should probably later raise the piece instead of invalidating
            const s = compose(
                set(posLens, [0, 19]),
                set(pieceLens, IPiece), // laying down stick piece
            )(state);  // rotating will make stick go though floor
            const expected = view(pieceLens, s);
            expect(rotateCounterClockwise(s).piece).toEqual(expected);
        });
        it('should return call value when piece overlapping after rotation', () => {
            const filledRowBoard = compose(
                update(dec(dec(ROW_COUNT)), filledRow),
                update(dec(ROW_COUNT), filledRow)
            )(emptyBoard);
            const s = compose(
                set(posLens, [5, 17]),
                set(pieceLens, IPiece),
                set(boardLens, filledRowBoard)
            )(state);
            // check to see that it doesn't overlap before rotation
            expect(b.isPieceOverlapping(s)).toBe(false);
            const expected = view(pieceLens, s);
            expect(rotateClockwise(s).piece).toEqual(expected);
            expect(rotateCounterClockwise(s).piece).toEqual(expected);
        });
        it('O-piece should not rotate', () => {
	        const s = compose(
		        set(posLens, [4, 2]),
		        set(pieceLens, c.PIECES.O),
	        )(state);
            expect(view(pieceCoordLens, rotateClockwise(s))).toEqual(c.PIECES.O);
            expect(view(pieceCoordLens, rotateCounterClockwise(s))).toEqual(c.PIECES.O);
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
            const cell1 = b.getCell(s, [5, dec(ROW_COUNT)]); // get cell from filled bottom row
            const cell2 = b.getCell(s, [5, 5]);  // empty
            expect(cell1).toEqual(FILL_TOKEN);
            expect(cell2).toEqual(EMPTY_TOKEN);
        });
        it('should write piece to board', () => {
            const s = compose(
                set(posLens, [1, 19]),
                set(pieceLens, IPiece),  // laying down I piece, going 1 block to left 2 to right
                set(boardLens, EMPTY_BOARD)
            )(state);
            const expected = concat(repeat(c.PIECES.I.token, 4), repeat(EMPTY_TOKEN, 6));
            expect(last(b.writeToBoard(s).board)).toEqual(expected);
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
            expect(b.isPieceOverlapping(s1)).toBe(true);
            // Raise pos by 1, should no longer overlap
            // const s2 = over(posLens, adjust(dec, 1), s1);
            // expect(isPieceOverlapping(s2)).toBe(false);
        });
        it('Should not detect overlap when coord out of bounds', () => {
            const coord = [4, -5];
	        const s = compose(
		        set(posLens, [4, -5]),  // Bottom middle
		        set(boardLens, emptyBoard),
                set(pieceLens, LPiece)
            )(state);
	        expect(b.isCoordOverlapping(s)([4, -5])).toBe(false);
        });
        it('should get empty cell from cell out of bounds', () => {
        	const s = set(boardLens, emptyBoard, state);
	        expect(b.getCell(s, [0, -5])).toEqual(EMPTY_TOKEN);
        })
    });
    describe('Piece Shadow', () => {
    	/* FIXME Actually I don't think I want to write shadow to board state like this
	       I think I'll go with having a shadowPos: [5,19] type of deal in state and then
	       the thing drawing the state can do whatever it wants. Will have to redo tests.
	       */
        it('should present piece shadow at lowest valid point', () => {
            // Because initializing with proper shadow is a bit harder than shadow after move this test first
            const tempState = compose(
                set(posLens, [4,0]),
                set(pieceLens, IPiece)
            )(state);
            const finalState = shiftDown(state);
            const bottomRow = last(view(boardLens, finalState));
            // FIXME This is a very lazy test, should make sure that piece shape is accurate
            expect(bottomRow).toContain(SHADOW_TOKEN);
        });
        it('should initialize board with piece shadow', () => {
            // Hmm actually how do I test this, I'm setting the state explicitly, unlike when react app
            // is run where it will have a random piece on init. An interesting solution to this
            // would be to have a top row that is invisible where all pieces spawn and immediately shift down
            // once to get shadow written.
            // I read that many old and maybe new(?) official tetris games actually have 40 rows internally
            // while only presenting 20 But maybe they meant that each row was subdivided by 2? Sounds likely
            const s = compose(
                set(posLens, [4,0]),
                set(pieceLens, IPiece)
            )(state);
            const bottomRow = last(view(boardLens, s));
            // FIXME This is a very lazy test, should make sure that piece shape is accurate
            expect(bottomRow).toContain(SHADOW_TOKEN);
        })
    });
	describe('Line Clear', () => {
		it('should clear filled line', () => {
			const board = update(dec(ROW_COUNT), filledRow, emptyBoard);
			const s = compose(
				set(posLens, [4,0]),
				set(pieceLens, IPiece),
				set(boardLens, board)
			)(state);
			// before clear last row should be filled
			expect(last(s.board)).not.toContain(EMPTY_TOKEN);
			// should now be cleared
			expect(last(b.clearLines(s).board)).toContain(EMPTY_TOKEN);
		});
		it('should move remaining lines down', () => {
			const secondLast = concat(repeat(c.PIECES.O.token, 4), repeat(EMPTY_TOKEN, 4));
			const board = compose(
				update(dec(ROW_COUNT), filledRow),
				update(dec(ROW_COUNT), secondLast)
			)(emptyBoard);
			const s = compose(
				set(posLens, [4,0]),
				set(pieceLens, IPiece),
				set(boardLens, board)
			)(state);
			const stateAfterClear = b.clearLines(s);
			const lastRow = last(stateAfterClear.board);
			expect(lastRow).toEqual(secondLast);
		});
	});
});