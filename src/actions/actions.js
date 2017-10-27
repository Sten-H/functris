import { createActions } from 'redux-actions';

export const {increment, decrement} = createActions({
    'INCREMENT': () => ({amount: 1}),
    'DECREMENT': () => ({amount: -1}),
    }
);

export const {shiftLeft, shiftRight} = createActions({
    'SHIFT_LEFT': ({board, piece}) =>  ({board, piece}),
    'SHIFT_RIGHT': ({board, piece}) =>  ({board, piece})
});