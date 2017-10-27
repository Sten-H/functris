import { handleActions } from 'redux-actions';
import piece from './pieceReducer';
import position from './positionReducer';
import { combineReducers } from "redux";
import { EMPTY_BOARD } from "./constants";

export const defaultState = EMPTY_BOARD;

const board = handleActions({}, defaultState);
export default combineReducers({board, piece, position});