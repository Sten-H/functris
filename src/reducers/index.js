import counter from './counter';
import tetris from './tetris/boardReducer';
import { combineReducers } from 'redux';

export default combineReducers({counter, tetris});