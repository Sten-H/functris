import * as constants from './logic/constants';
import * as actions from '../../actions/actions';
import { handleActions } from "redux-actions";
import * as logic from "./logic/logic";
import { getShuffledBag } from "./logic/bagLogic";

const defaultState = {
    board: constants.EMPTY_BOARD,
    piece: constants.PIECES.L,
    pos: [5, 6],
    bag: getShuffledBag()
};
const reducer = handleActions({
    // I could combine all shifts (atleast horizontal) by having the action send the direction as an argument
    // So it would be logic.shift(leftDir, state)
    // FIXME I could probably remove the spread from all of these and just return the value from func
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
    [actions.shiftDown](state) {
        return {
            ...logic.shiftDown(state)
        };
    },
    [actions.dropPiece](state) {
        return {
            ...state
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