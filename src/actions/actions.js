import { createActions } from 'redux-actions';

export const {shiftLeft, shiftRight, rotateClockwise, rotateCounter} = createActions({
    'SHIFT_LEFT': () =>  ({}),
    'SHIFT_RIGHT': () =>  ({}),
    'ROTATE_CLOCKWISE': () => ({}),
    'ROTATE_COUNTER': () => ({})
});
// tick