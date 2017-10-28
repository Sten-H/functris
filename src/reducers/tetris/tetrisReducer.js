import * as constants from './logic/constants';
import * as actions from '../../actions/actions';
import { handleActions } from "redux-actions";

const defaultState = {
    board: constants.EMPTY_BOARD,
    piece: constants.PIECES.L,
    position: [0, 0]
};
const reducer = handleActions({
    [actions.shiftLeft](state, {payload: {board, piece}}) {
        console.log("position reducer");
        return {
            ...state
        };
    }
}, defaultState);

export default reducer;