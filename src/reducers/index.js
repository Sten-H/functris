import counter from './counter';
import tetris from './tetris/tetrisReducer'
import { combineReducers } from 'redux';

export default combineReducers({counter, tetris});