import * as constants from './logic/constants';
import * as actions from '../../actions/actions';
import { handleActions } from "redux-actions";
import * as logic from "./logic/logic";
import { getBag } from "./logic/bagLogic";

const defaultState = {
    board: constants.EMPTY_BOARD,
    piece: constants.PIECES.L,
    pos: [5, 6],
    bag: getBag()
};
const reducer = handleActions({
    [actions.shiftLeft](state) {
        return {
            ...logic.shiftLeft(state)
        };
    },
    [actions.shiftRight](state) {
        return {
            ...logic.shiftRight(state)
        };
    },
    [actions.rotateClockwise](state) {
        return {
            ...logic.rotateClockwise(state)
        }
    },
    [actions.rotateCounter](state) {
        return {
            ...logic.rotateCounterClockwise(state)
        }
    }
}, defaultState);

export default reducer;