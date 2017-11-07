import {
	shiftLeft, shiftRight, rotateClockwise, rotateCounterClockwise,
	shiftDown, dropPiece,
} from './movementLogic';
import {
	compose, concat, dec, last, prop, repeat, set, subtract, update, view, path, over, adjust,
} from 'ramda';
import {
	EMPTY_TOKEN, FILL_TOKEN, COL_COUNT, SHADOW_TOKEN, FILLED_ROW
} from './constants/index';
import * as c from './constants/index';
import { getTestState, lens } from './helpers';
import * as b from './boardLogic';

describe('Tetris Movement', () => {
    describe('Shift piece', () => {
        describe('Horizontal', () => {
            it('should shift horizontally', () => {
                const s = getTestState({pos: [5, 5]});
                const expected = [4, 5];
                expect(shiftLeft(s).pos).toEqual(expected);
            });
            it('should return call value when piece out of bounds after shift', () => {
	            const s1 = getTestState({pos: [0, 5]});
                const expected1 = [0, 5];
                expect(shiftLeft(s1).pos).toEqual(expected1);
	            const s2 = getTestState({pos: [7, 10]});
                const expected2 = [7, 10];
                // Check to see that it is valid before move
                expect(b.isPieceOutOfBounds(s2)).toBe(false);
                // Stick will be out of bounds on right shift, should not move
                expect(shiftRight(s2).pos).toEqual(expected2)
            });
            it('should shift piece that is partly outside of top y bounds (top of screen)', () => {
                const startPos = [4, 0];
                const s = getTestState({pos: [4, 0], piece: c.PIECES.I});
                expect(shiftRight(s).pos).not.toEqual(startPos);
            });
            it('should return call value when  piece overlapping after shift', () => {
                const lastRow = update(0, FILL_TOKEN, repeat(EMPTY_TOKEN, COL_COUNT));
                const s = getTestState({board: [lastRow],
                    piece: { coords: [ [ 0, 0 ] ], token: "I" }, pos: [1, dec(c.ROW_COUNT)] });
                const expected = [1, dec(c.ROW_COUNT)];
                expect(shiftLeft(s).pos).toEqual(expected);
            });
        });
        describe('Vertical', () => {
            it('should shift vertically', () => {
                const s = getTestState({pos: [5,5]});
                const expected = [5, 6];
                expect(shiftDown(s).pos).toEqual(expected);
            });
        });
        describe('Drop piece', () => {
            it('should drop piece to empty bottom row', () => {
                const s = getTestState({pos: [4,0], piece: c.PIECES.I});
                // expect bottom row to contain filled cells after drop
	            const stateAfterDrop = dropPiece(s);
	            const expected = [4, dec(c.ROW_COUNT)];
                expect(stateAfterDrop.pos).toEqual(expected);
            });
            it('should drop piece to first encountered filled block', () => {
	            // board has one block in bottom middle
                const bottomRow = concat(repeat(EMPTY_TOKEN, 4), repeat(FILL_TOKEN, 1), repeat(EMPTY_TOKEN, 5));
                // O-piece has pivot in upper row
                const s = getTestState({board: [bottomRow], piece: c.PIECES.O, pos: [4, 0]});
                const stateAfterDrop = dropPiece(s);
                // Expect position to drop down to second to last row
                const expected = [4, subtract(c.ROW_COUNT, 2)]; // one up for row block, and 1 for o piece pivot
                expect(stateAfterDrop.pos).toEqual(expected);
            });
        });
    });
    describe('Rotate', () => {
        it('should rotate clockwise', () => {
	        const s = getTestState({pos: [5,5], piece: c.PIECES.L});
            const expected = { coords: [ [ 1,  1], [ 0, -1], [ 0,  0], [ 0,  1] ], token: "L"};
            expect(rotateClockwise(s).piece).toEqual(expected);
        });
        it('should rotate counter clockwise', () => {
	        const s = getTestState({pos: [5,5], piece: c.PIECES.L});
            const expected = { coords: [ [-1, -1], [ 0,  1], [ 0,  0], [ 0, -1] ], token: "L"};
            expect(rotateCounterClockwise(s).piece).toEqual(expected);
        });
        it('rotate counter then clockwise should revert to original', () => {
	        const s = getTestState({pos: [5,5], piece: c.PIECES.I});
	        const expected = prop('piece')(s);
            const rotated = compose(
                prop('piece'),
                rotateClockwise,
                rotateCounterClockwise
            )(s);
            expect(rotated).toEqual(expected);
        });
        it('piece rotated counter should not be equal piece rotated clockwise (except OPiece)', () => {
        	const s1 = getTestState({pos: [5,5], piece: c.PIECES.I});
            expect(rotateClockwise(s1).piece).not.toEqual(rotateCounterClockwise(s1).piece);
            const s2 = getTestState({pos: [5,5], piece: c.PIECES.I});
            expect(rotateClockwise(s2).piece).not.toEqual(rotateCounterClockwise(s2).piece);
        });
        it('should return call value if piece out of x bounds after rotation', () => {
	        const upStick = { coords: [[0, 0], [0, 1], [0, 2], [0, -1]], token: 'I' };
        	const s = getTestState({pos: [0,5], piece: upStick});
            const expected = view(lens.piece, s);
            expect(rotateClockwise(s).piece).toEqual(expected);
        });
        it('should rotate piece, even if it it is out of "legal" bounds after rotation', () => {
	        const s = getTestState({pos: [4, 2], piece: c.PIECES.L});
            expect(rotateClockwise(s).piece.coords).not.toEqual(c.PIECES.L.coords);
        });
        it('should return call value if piece out of lower y bound after rotation', () => {
            // FIXME this should probably later raise the piece instead of invalidating
            const s = getTestState({pos: [0, dec(c.ROW_COUNT)], piece: c.PIECES.I});
            const expected = view(lens.piece, s);
            expect(rotateCounterClockwise(s).piece).toEqual(expected);
        });
        it('should return call value when piece overlapping after rotation', () => {
	        const s = getTestState({board: repeat(FILLED_ROW, 2),
		        piece: c.PIECES.I, pos: [5, subtract(c.ROW_COUNT, 3)]});
            // check to see that it doesn't overlap before rotation
            expect(b.isPieceOverlapping(s)).toBe(false);
            const expected = view(lens.piece, s);
            expect(rotateClockwise(s).piece).toEqual(expected);
            expect(rotateCounterClockwise(s).piece).toEqual(expected);
        });
        it('O-piece should not rotate', () => {
        	const s = getTestState({pos: [4, 2], piece: c.PIECES.O});
            expect(view(lens.pieceCoord, rotateClockwise(s))).toEqual(c.PIECES.O.coords);
            expect(view(lens.pieceCoord, rotateCounterClockwise(s))).toEqual(c.PIECES.O.coords);
        });
    });
    describe('Overlap detection', () => {
        it('should detect overlap', () => {
        	const s1 = getTestState({pos: [5, dec(c.ROW_COUNT)], board: [c.FILLED_ROW], piece: c.PIECES.I});
            expect(b.isPieceOverlapping(s1)).toBe(true);
            // Raise pos by 1, should no longer overlap
            const s2 = over(lens.pos, adjust(dec, 1), s1);
            expect(b.isPieceOverlapping(s2)).toBe(false);
        });
        it('Should not detect overlap when coord out of bounds', () => {
            const s = getTestState({pos: [4, -5], piece: c.PIECES.L});
	        expect(b.isCoordOverlapping(s)([4, -5])).toBe(false);
        });
        it('should get empty cell from cell out of bounds', () => {
        	const s = getTestState();
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
	        const tempState = getTestState({ pos: [4, 0], piece: c.PIECES.I });
            const finalState = shiftDown(tempState);
            const bottomRow = last(view(lens.board, finalState));
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
	        const s = getTestState({pos: [4,0], piece: c.PIECES.I});
            const bottomRow = last(view(lens.board, s));
            // FIXME This is a very lazy test, should make sure that piece shape is accurate
            expect(bottomRow).toContain(SHADOW_TOKEN);
        })
    });
});