import * as constants from '../../game-logic/constants';
import * as actions from '../../actions/actions';
import { handleActions } from "redux-actions";
import * as logic from "../../game-logic/movementLogic";
import { getShuffledBag } from "../../game-logic/bagLogic";
import { __, clamp, compose, identity, ifElse, not, over, subtract, view } from 'ramda';
import { lens } from '../../game-logic/helpers';
import * as c from '../../game-logic/constants';

const defaultState = {
    board: constants.EMPTY_BOARD,
    piece: constants.PIECES.L,
    pos: c.START_POS,
    bag: getShuffledBag(),
	info: {
    	gameOver: false,  // When true game should not be unpausable
		score: 0,
		lines: 0
	},
    options: {
	    tickRate: c.INITIAL_TICK_RATE,
        paused: false,
        shadow: true
    }
};
const isPaused = view(lens.options.paused);
// FIXME I think this function should be in some root 'tetris api' file that doesn't exist
const executeTranform = (transformFunc) => ifElse(
	isPaused,
	identity,
	transformFunc
);
const reducer = handleActions({
    // I could combine all shifts (atleast horizontal) by having the action send the direction as an argument
    // So it would be logic.shift(leftDir, state)
    [actions.shiftLeft](state) {
        return executeTranform(logic.shiftLeft)(state)
    },
    [actions.shiftRight](state) {
        return executeTranform(logic.shiftRight)(state)
    },
    [actions.shiftDown](state) {
        return executeTranform(logic.shiftDown)(state)
    },
    [actions.dropPiece](state) {
        return executeTranform(logic.dropPiece)(state);
    },
    [actions.rotateClockwise](state) {
        return executeTranform(logic.rotateClockwise)(state)
    },
    [actions.rotateCounter](state) {
        return executeTranform(logic.rotateCounterClockwise)(state)
    },
	[actions.togglePause](state) {
		return over(lens.options.paused, not, state);
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