import { handleActions } from "redux-actions";
import * as actions from "../../../actions/actions";
import { dec, inc, lensIndex, over } from "ramda";
const xLens = lensIndex(0);
const yLens = lensIndex(1);
const defaultState = [0, 0];

const shift = over(xLens);
const leftDir = dec;
const rightDir = inc;
export const shiftLeft = shift(leftDir);
export const shiftRight = shift(rightDir);
// state in reducer is only position, that is why board and piece are passed in payload
const reducer = handleActions({
    [actions.shiftLeft](state, {payload: {board, piece}}) {
        console.log(state);
        return state;
    }
}, defaultState);
export default reducer