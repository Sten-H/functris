import * as c from './constants';
import {
	add, clamp, compose, concat, converge, dec, equals, lensIndex, lensPath, lensProp, map, over, reverse, view,
	when, zipWith
} from 'ramda';

// LENSES
export const lens = {
	pos: lensProp('pos'),
	board: lensProp('board'),
	piece: lensProp('piece'),
	pieceCoord: lensPath(['piece', 'coords']),
	pieceToken: lensPath(['piece', 'token']),
	bag: lensProp('bag'),
	bagLength: lensPath(['bag', 'length']),
	coord: {
		x: lensIndex(0),
		y: lensIndex(1)
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

// GENERAL HELPER FUNCTIONS
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