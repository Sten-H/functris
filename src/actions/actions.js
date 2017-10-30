import { createActions } from 'redux-actions';

export const {shiftLeft, shiftRight, shiftDown, rotateClockwise, rotateCounter} = createActions({
    'SHIFT_LEFT': () =>  ({}),
    'SHIFT_RIGHT': () =>  ({}),
    'SHIFT_DOWN': () => ({}),
    'ROTATE_CLOCKWISE': () => ({}),
    'ROTATE_COUNTER': () => ({})
});
