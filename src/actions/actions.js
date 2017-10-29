import { createActions } from 'redux-actions';

export const {increment, decrement} = createActions({
    'INCREMENT': () => ({amount: 1}),
    'DECREMENT': () => ({amount: -1}),
    }
);
// position
export const {shiftLeft, shiftRight, rotateClockwise, rotateCounter} = createActions({
    'SHIFT_LEFT': () =>  ({}),
    'SHIFT_RIGHT': () =>  ({}),
    'ROTATE_CLOCKWISE': () => ({}),
    'ROTATE_COUNTER': () => ({})
});
// tick