import { createActions } from 'redux-actions';

export const {shiftLeft, shiftRight, shiftDown, dropPiece, rotateClockwise, rotateCounter} = createActions({
    'SHIFT_LEFT': () =>  ({}),
    'SHIFT_RIGHT': () =>  ({}),
    'SHIFT_DOWN': () => ({}),
    'DROP_PIECE': () => ({}),
    'ROTATE_CLOCKWISE': () => ({}),
    'ROTATE_COUNTER': () => ({})
});
