import * as constants from '../../tetris-logic/game-logic/constants';
import * as actions from '../../actions/actions';
import { handleActions } from "redux-actions";
import tetris from "../../tetris-logic/game-logic/main";
import { getShuffledBag } from "../../tetris-logic/game-logic/bagLogic";
import { __, clamp, compose, head, over, subtract, tail } from 'ramda';
import { lens } from '../../tetris-logic/game-logic/helpers';
import * as c from '../../tetris-logic/game-logic/constants';

const resetState = () =>  {
	const startBag = getShuffledBag();
	const startState = {
		board: constants.EMPTY_BOARD,
		pos: c.START_POS,
		bag: tail(startBag),
		piece: head(startBag),
		flags: {
			lockRequested: false,
			gameOver: false,  // When true game should not be unpausable

		},
		info: {
			score: 0,
			lines: 0
		},
		options: {
			tickRate: c.INITIAL_TICK_RATE,
			paused: false,
			shadow: true
		}
	};
	return startState
};
const reducer = handleActions({
    // I could combine all shifts (atleast horizontal) by having the action send the direction as an argument
    // So it would be tetris.shift(leftDir, state), not sure if I want to
    [actions.shiftLeft](state) {
        return tetris.shiftLeft(state)
    },
    [actions.shiftRight](state) {
        return tetris.shiftRight(state)
    },
    [actions.shiftDown](state) {
        return tetris.shiftDown(state)
    },
    [actions.dropPiece](state) {
        return tetris.dropPiece(state);
    },
    [actions.rotateClockwise](state) {
        return tetris.rotateClockwise(state)
    },
    [actions.rotateCounter](state) {
        return tetris.rotateCounterClockwise(state)
    },
	[actions.togglePause](state) {
		return tetris.togglePause(state);
	},
	[actions.restartGame](state) {
    	return resetState();
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
}, resetState());

export default reducer;