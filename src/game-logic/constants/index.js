import { repeat, subtract } from 'ramda';

export const COL_COUNT = 10;
/**
 * The game has n of rows but not all of them are legal to write to, the topmost rows are to check
 * for top outs (illegal row being filled with non emtpy-symbol tokens), and to spawn pieces)
 * @type {number}
 */
export const ROW_COUNT = 25;
export const LEGAL_ROWS = 20;
export const ILLEGAL_ROWS = subtract(ROW_COUNT, LEGAL_ROWS);
export const START_POS = [4, subtract(ROW_COUNT, LEGAL_ROWS)];
export const MAX_CLEAR = 4;
export const INITIAL_TICK_RATE = 1000;
export const EMPTY_TOKEN = "E";
export const FILL_TOKEN = "X";
export const SHADOW_TOKEN = "S";  // Unused as of now, for piece shadow
export const EMPTY_ROW = repeat(EMPTY_TOKEN, COL_COUNT);
export const FILLED_ROW = repeat(FILL_TOKEN, COL_COUNT);  // Fill token is made up token
export const EMPTY_BOARD = repeat(EMPTY_ROW, ROW_COUNT);
export const PIECES = {
    I: { coords: [ [-1,  0], [0,  0], [ 1,  0], [ 2,  0] ], token: "I" },
    T: { coords: [ [ 0, -1], [-1,  0], [ 0,  0], [ 1,  0]], token: "T" },
    O: { coords: [ [ 0, -1], [ 1, -1], [ 0,  0], [ 1,  0] ], token: "O" },
    J: { coords: [ [-1, -1], [-1,  0], [ 0,  0], [ 1,  0] ], token: "J" },
    L: { coords: [ [ 1, -1], [-1,  0], [ 0, 0], [ 1,  0] ], token: "L" },
    S: { coords: [ [ 0, -1], [ 1, -1], [-1,  0], [ 0,  0] ], token: "S" },
    Z: { coords: [ [-1, -1], [ 0, -1] ,[ 0,  0], [ 1,  0] ], token: "Z"}
};