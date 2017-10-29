import * as constants from './logic/constants';
import * as actions from '../../actions/actions';
import { handleActions } from "redux-actions";
import * as logic from "./logic/logic";

const defaultState = {
    board: constants.EMPTY_BOARD,
    piece: constants.PIECES.L,
    pos: [5, 6]
};
const reducer = handleActions({
    [actions.shiftLeft](state) {
        console.log("shiftLeft(state)");
        return {
            ...logic.shiftLeft(state)
        };
    },
    [actions.shiftRight](state) {
        console.log("shiftRight(state)");
        return {
            ...logic.shiftRight(state)
        };
    },
    [actions.rotateClockwise](state) {
        console.log('rotate clockwise');
        return {
            ...logic.rotateClockwise(state)
        }
    },
    [actions.rotateCounter](state) {
        console.log('rotate counter clockwise');
        return {
            ...logic.rotateCounterClockwise(state)
        }
    }
}, defaultState);

export default reducer;