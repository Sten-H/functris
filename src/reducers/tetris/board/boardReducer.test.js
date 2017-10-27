import { EMPTY_TOKEN } from '../constants';
import { all, equals } from 'ramda';
import { defaultState } from "./boardReducer";

describe('Tetris board', () => {
    const row = defaultState[0];
    describe('Board', () => {
        it('should have 20 rows and 10 columns', () => {
            expect(defaultState).toHaveLength(20);
            expect(row).toHaveLength(10);
        });
        it('Default state row values should be empty tokens', () => {
            expect(all(equals(EMPTY_TOKEN), row)).toBe(true);
        });
    });
});
