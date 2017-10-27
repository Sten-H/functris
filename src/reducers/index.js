import counter from './counter';
import tetris from './tetris'
import { combineReducers } from 'redux';

export default combineReducers({counter, tetris});