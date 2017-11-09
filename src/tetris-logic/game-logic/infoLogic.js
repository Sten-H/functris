import {
	__,
	add, always, compose, converge, divide, filter, identity, juxt, length, mergeWith, multiply, set, subtract, tap,
	view,
	zipObj,
} from 'ramda';
import { isRowFull } from './boardLogic';
import { lens } from './helpers';

/**
 * infoLogic handles score, level (affects gravity speed), and lines cleared (increases level).
 * How much you are rewarded per line depends on how many lines you cleared in one move and at what level.
 */
// state -> number
const fullRowCount = compose(
	length,
	filter(isRowFull),
	view(lens.board)
);
// const updateLevel = identity;
// const updateScore = (state, linesCleared) => identity;
// // state -> state
// const addToLines = (lines, state) =>
// 	converge(
// 		over(lens.info.lines, add(lines), state),
// 		[
// 			fullRowCount,
// 			identity
// 		]
// 	);
// FIXME scoring should be done from a table look up basically, looking up the value of 0-4 rows cleared and multiplying by level
const calculateScore = multiply(10);
// FIXME this is just a mock fucntion that calculates level from lines, not real algorithm most likely
const calculateLevel = compose(Math.floor, divide(__, 10));
// (i, j) -> l, this function got out of hand because it wants to calculate the difference of old level and new level
// so it can be added to previous level together with the other values
const calculateLevelChange = (cleared, oldLines) =>
	converge(
		subtract,
		[compose(
			calculateLevel,
			add(oldLines)
		),
			always(calculateLevel(oldLines))
		]
	)(cleared);
// state -> info
const getChange = compose(
	zipObj(['lines', 'score', 'level']),
	converge(
		juxt([identity, calculateScore, calculateLevelChange]),
		[fullRowCount, view(lens.info.lines)]  // Only calculateLevelChange uses the secondValue
	)
);
// state -> info
const getUpdatedValues =
	converge(
	mergeWith(add),
	[getChange, view(lens.info.all)]
);
// state -> state
export const updateInfo =
	converge(
		set(lens.info.all),
		[getUpdatedValues, identity]
	);