import {combineActions, handleActions} from 'redux-actions';
import { increment, decrement } from "../actions/actions"

const defaultState = { value: 0 };

export const reducer = handleActions({
    [combineActions(increment, decrement)](state, {payload: {amount}}) {
        return { value: state.value + amount }
    }
}, defaultState);

export default reducer;