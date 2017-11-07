import * as mv from './movementLogic';
import * as brd from './boardLogic';
import * as bag from './bagLogic';
import { always, compose, either, identity, ifElse, not, or, over, set, tap, view, when } from 'ramda';
import { lens } from './helpers';
import * as c from './constants/index';
// PRIVATE FUNCS
const isPaused = view(lens.options.paused);
const isGameOver = view(lens.flags.gameOver);
const isGameHalted = either(isPaused, isGameOver);
// state -> state
const gameOver = compose(
	// FIXME this func will probably do more later. Such as filling the board with randomly colored blocks and such.
	set(lens.flags.gameOver, true),
);
export const isIllegalState = either(brd.isPieceOverlapping, brd.isTopOut);
// state -> state
export const lockPiece = compose(
	set(lens.flags.lockRequested, false),
	bag.getNextPiece,
	brd.clearLines,
	mv.setToStartPos,
	brd.writeToBoard
);
// transform -> state -> state
const execute = (transformFunc) => compose(
	when(
		isIllegalState,
		gameOver,
	),
	when(
		view(lens.flags.lockRequested),
		lockPiece
	),
	transformFunc
);
// state -> state
const tryExecute = (transformFunc) => ifElse(
	isGameHalted,
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