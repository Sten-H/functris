import * as mv from './movementLogic';
import * as brd from './boardLogic';
import * as bag from './bagLogic';
import { compose, either, identity, ifElse, not, over, set, view, when } from 'ramda';
import { lens, pieceActualPosition } from './helpers';
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
// state -> [coord]
export const getShadow = compose(
	pieceActualPosition,
	mv.dropPiece
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

export default { shiftLeft, shiftRight, shiftDown, dropPiece, rotateClockwise, rotateCounterClockwise, togglePause,
	getShadow}