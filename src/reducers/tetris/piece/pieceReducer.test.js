import { rotatePieceClockwise, rotatePieceCounter } from "./pieceReducer";
import { handleActions } from "redux-actions";

describe('Piece', () => {
    const LPiece = [ [ 1, -1], [-1,  0], [ 0,  0], [ 1,  0] ];  // L piece: -->  ___|
    const IPiece = [ [-1,  0], [0,  0], [ 1,  0], [ 2,  0] ];  // I piece --> ____
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
});