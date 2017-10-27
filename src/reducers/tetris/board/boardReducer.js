import { handleActions } from 'redux-actions';
import { EMPTY_BOARD } from "../constants";

export const defaultState = EMPTY_BOARD;

const reducer = handleActions({}, defaultState);
export default reducer;