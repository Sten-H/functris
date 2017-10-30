import * as actions from './actions';
import { prop } from "ramda";

describe('Actions', () => {
    it('should create shift left action', () => {
        const expected = 'SHIFT_LEFT';
        expect(prop('type', actions.shiftLeft())).toEqual(expected);
    });
    it('should create shift right action', () => {
        const expected = 'SHIFT_RIGHT';
        expect(prop('type', actions.shiftRight())).toEqual(expected);
    });
    it('should create shift down action', () => {
        const expected = 'SHIFT_DOWN';
        expect(prop('type', actions.shiftDown())).toEqual(expected);
    });
    it('should create rotate clockwise action', () => {
        const expected = 'ROTATE_CLOCKWISE';
        expect(prop('type', actions.rotateClockwise())).toEqual(expected);
    });
    it('should create rotate counter clockwise action', () => {
        const expected = 'ROTATE_COUNTER';
        expect(prop('type', actions.rotateCounter())).toEqual(expected);
    });
});