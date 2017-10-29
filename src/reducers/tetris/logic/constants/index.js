import { repeat } from "ramda";

export const COL_COUNT = 10;
export const ROW_COUNT = 20;
export const EMPTY_TOKEN = "  ";
export const FILL_TOKEN = "□";
const EMPTY_ROW = new Array(COL_COUNT).fill(EMPTY_TOKEN);
export const EMPTY_BOARD = repeat(EMPTY_ROW, ROW_COUNT);

export const PIECES = {
    I: [ [-1,  0], [0,  0], [ 1,  0], [ 2,  0] ],
    T: [ [ 0, -1], [-1,  0], [ 0,  0], [ 1,  0] ],
    O: [ [ 0, -1], [ 1, -1], [ 0,  0], [ 1,  0] ],
    J: [ [-1, -1], [-1,  0], [ 0,  0], [ 1,  0] ],
    L: [ [ 1, -1], [-1,  0], [ 0, 0], [ 1,  0] ],
    S: [ [ 0, -1], [ 1, -1], [-1,  0], [ 0,  0] ],
    Z: [ [-1, -1], [ 0, -1] ,[ 0,  0], [ 1,  0] ]
};