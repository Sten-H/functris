import * as mv from './movementLogic';
import * as brd from './boardLogic';
import * as bag from './bagLogic';
import { compose, identity, ifElse, not, over, set, view, when } from 'ramda';
import { lens } from './helpers';
import * as c from './constants/index';
// PRIVATE FUNCS
const isPaused = view(lens.options.paused);
// state -> state
export const lockPiece = compose(
	set(lens.flags.lockRequested, false),
	bag.getNextPiece,
	brd.clearLines,
	set(lens.pos, c.START_POS),
	brd.writeToBoard
);
// transform -> state -> state
const execute = (transformFunc) => compose(
	when(
		view(lens.flags.lockRequested),
		lockPiece
	),
	transformFunc
);
// state -> state
const tryExecute = (transformFunc) => ifElse(
	isPaused,
	identity,
	execute(transformFunc)
);
// PUBLIC FUNCS
// state -> state for all public funcs
const shiftLeft = tryExecute(mv.shiftLeft);
const shiftRight = tryExecute(mv.shiftRight );
const shiftDown = tryExecute(mv.shiftDown);
const dropPiece = tryExecute(mv.dropPiece);
const rotateClockwise = tryExecute(mv.rotateClockwise);
const rotateCounterClockwise = tryExecute(mv.rotateCounterClockwise);
const togglePause = over(lens.options.paused, not);

export default { shiftLeft, shiftRight, shiftDown, dropPiece, rotateClockwise, rotateCounterClockwise, togglePause }