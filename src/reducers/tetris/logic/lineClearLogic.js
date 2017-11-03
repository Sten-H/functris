import { identity, map, over } from 'ramda';
import { boardLens } from './logic';

/**
 * Functions for finding and clearing lines from board, should probably also update score
 */
const isRowFull = () => null;
export const clearLines = over(
	boardLens,
	map()
);