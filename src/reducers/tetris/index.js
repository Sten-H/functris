import board from './board/boardReducer';
import piece from './piece/pieceReducer';
import position from './position/positionReducer';
import { combineReducers } from "redux";

export default combineReducers({board, piece, position});