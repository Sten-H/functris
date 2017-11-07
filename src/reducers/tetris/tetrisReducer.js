import * as constants from '../../game-logic/constants';
import * as actions from '../../actions/actions';
import { handleActions } from "redux-actions";
import tetris from "../../game-logic/main";
import { getShuffledBag } from "../../game-logic/bagLogic";
import { __, clamp, compose, identity, ifElse, not, over, subtract, view } from 'ramda';
import { lens } from '../../game-logic/helpers';
import * as c from '../../game-logic/constants';

const defaultState = {
    board: constants.EMPTY_BOARD,
    piece: constants.PIECES.L,
    pos: c.START_POS,
    bag: getShuffledBag(),
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
const reducer = handleActions({
    // I could combine all shifts (atleast horizontal) by having the action send the direction as an argument
    // So it would be tetris.shift(leftDir, state)
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