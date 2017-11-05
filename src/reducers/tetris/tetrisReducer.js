import * as constants from '../../game-logic/constants';
import * as actions from '../../actions/actions';
import { handleActions } from "redux-actions";
import * as logic from "../../game-logic/movementLogic";
import { getShuffledBag } from "../../game-logic/bagLogic";
import { __, clamp, compose, over, subtract } from 'ramda';
import { lens } from '../../game-logic/helpers';

const defaultState = {
    board: constants.EMPTY_BOARD,
    piece: constants.PIECES.L,
    pos: [5, 1],
    bag: getShuffledBag(),
    options: {
	    tickRate: 1000,
        paused: false,
        shadow: true
    }
};
const reducer = handleActions({
    // I could combine all shifts (atleast horizontal) by having the action send the direction as an argument
    // So it would be logic.shift(leftDir, state)
    [actions.shiftLeft](state) {
        return logic.shiftLeft(state)
    },
    [actions.shiftRight](state) {
        return logic.shiftRight(state)
    },
    [actions.shiftDown](state) {
        return logic.shiftDown(state)
    },
    [actions.dropPiece](state) {
        return logic.dropPiece(state);
    },
    [actions.rotateClockwise](state) {
        return logic.rotateClockwise(state)
    },
    [actions.rotateCounter](state) {
        return logic.rotateCounterClockwise(state)
    },
	[actions.decreaseTick](state) {
    	const DECREASE_RATE = 100;  // FIXME temporary variable
		return over(
			lens.options.tick,
			compose(
				clamp(0, Number.MAX_VALUE),
				subtract(__, DECREASE_RATE)
			)
		)(state);
	}
}, defaultState);

export default reducer;