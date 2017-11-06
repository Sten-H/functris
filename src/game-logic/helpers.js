import * as c from './constants';
import {
	add, always, clamp, compose, concat, converge, countBy, curry, dec, equals, identity, ifElse, isNil, lensIndex,
	lensPath, lensProp, map, over, prop, reverse, set, takeLast, view, when, zipWith
} from 'ramda';
// TEST HELPERS
const defaultState = {
	board: [],
	piece: [],
	pos: [],
	bag: [],
	info: {
		gameOver: false,  // When true game should not be unpausable
		score: 0,
		lines: 0
	},
	options: {
		tickRate: -1,
		paused: false,
		shadow: true
	}
};
const defaultBag = [ c.PIECES.L, c.PIECES.I, c.PIECES.O, c.PIECES.J,
	c.PIECES.Z, c.PIECES.L, c.PIECES.T, c.PIECES.S ];
const defaultOptions = { paused:false, shadow: true, tickRate: c.INITIAL_TICK_RATE };
const defaultInfo = { gameOver: false, lines: 0, score: 0 };
const fillBoardBottomUp = compose(
	takeLast(c.ROW_COUNT),
	concat(c.EMPTY_BOARD)
);
/**
 * Get new state, all unassigned values in argument map will have default values.
 * Board value is special. You can send an incomplete board of 4 rows and it will add
 * rows to bottom and fill top with empty rows.
 * @returns {Function}
 */
export const getTestState = ({board=c.EMPTY_BOARD, piece=c.PIECES.I, pos=c.START_POS,
	bag=defaultBag, options=defaultOptions, info= defaultInfo} = {}) => {
	const s = compose(
		set(lens.board, fillBoardBottomUp(board)),
		set(lens.pos, pos),
		set(lens.piece, piece),
		set(lens.bag, bag),
		set(lens.info.all, info),
		set(lens.options.all, options)
	)(defaultState);
	return s;
};
// GENERAL HELPERS
// LENSES
export const lens = {
	pos: lensProp('pos'),
	board: lensProp('board'),
	piece: lensProp('piece'),
	pieceCoord: lensPath(['piece', 'coords']),
	pieceToken: lensPath(['piece', 'token']),
	bag: lensProp('bag'),
	bagLength: lensPath(['bag', 'length']),
	flags: {
		lockRequested: lensPath(['flag', 'lockRequested'])
	},
	coord: {
		x: lensIndex(0),
		y: lensIndex(1)
	},
	info: {
		gameOver: lensPath(['info', 'gameOver']),
		score: lensPath(['info', 'score']),
		lines: lensPath(['info', 'lines']),
		all: lensProp('info')

	},
	options: {
		tick: lensPath(['options', 'tickRate']),
		paused: lensPath(['options', 'paused']),
		shadow: lensPath(['options', 'shadow']),
		all: lensProp(['options'])
	},
	// cell lens creates the lens as it is supplied with a coord
	cell: compose(lensPath,
		concat(['board']),
		reverse)
};

// FUNCTIONS
// n -> n, transforms -0 to 0
export const normalizeZero = when(equals(-0), Math.abs);

// c -> c Sets all -0 to 0 in coord.
export const normalizeCoord = map(normalizeZero);

// c -> c
export const clampCoord = compose(
	over(lens.coord.y, clamp(0, dec(c.ROW_COUNT))),
	over(lens.coord.x, clamp(0, dec(c.COL_COUNT))),
);

// c -> c -> c
export const addCoords = zipWith(add);

// state -> piece, adds position value to each piece coord to get true position
export const pieceActualPosition = converge(
	map,
	[compose(addCoords, view(lens.pos)), view(lens.pieceCoord)]
);
// string -> row -> number
export const tokensInRow = curry((token, row) => compose(
	ifElse(isNil, always(0), identity),
	prop('true'),
	countBy(equals(token)),
)(row));