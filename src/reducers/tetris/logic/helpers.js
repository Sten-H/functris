import * as c from 'constants';
import {
	add, clamp, compose, concat, converge, dec, equals, lensIndex, lensPath, lensProp, map, over, reverse, view,
	when, zipWith
} from 'ramda';

// LENSES
export const posLens = lensProp('pos');
export const boardLens = lensProp('board');
export const pieceLens = lensProp('piece');
export const coordLens = lensProp('coords');
export const pieceCoordLens = lensPath(['piece', 'coords']);
export const pieceTokenLens = lensPath(['piece', 'token']);
export const bagLens = lensProp('bag');

// cell lens from state (ex: ['board', [0, 1]). coord is reversed because board is [y, x] oriented
export const cellLens = compose(lensPath,
	concat(['board']),
	reverse);
// Coord lenses
export const xLens = lensIndex(0);
export const yLens = lensIndex(1);

// GENERAL HELPER FUNCTIONS
// n -> n, transforms -0 to 0
export const normalizeZero = when(equals(-0), Math.abs);

// c -> c Sets all -0 to 0 in coord.
export const normalizeCoord = map(normalizeZero);

// c -> c
export const clampCoord = compose(
	over(yLens, clamp(0, dec(c.ROW_COUNT))),
	over(xLens, clamp(0, dec(c.COL_COUNT))),
);

// c -> c -> c
export const addCoords = zipWith(add);

// state -> piece, adds position value to each piece coord to get true position
export const pieceActualPosition = converge(
	map,
	[compose(addCoords, view(posLens)), view(pieceCoordLens)]
);