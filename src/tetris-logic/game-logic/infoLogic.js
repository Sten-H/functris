import {
	__,
	add, always, clamp, compose, converge, divide, filter, identity, inc, juxt, length, mergeWith, multiply, nth, over,
	set,
	subtract,
	view, zipObj,
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
/**
 * score system is sort of stripped form of the modern guideline
 * http://tetris.wikia.com/wiki/Scoring, I've only taken the lines cleared part.
 * Guideline also has weird spins and back to back, and rewards for hard and soft dropping.
 * If I'm only using lines cleared I should consider NES scoring system, but I didn't like
 * how heavily it favored 4 line clears
 */
const SCORE_TABLE = [0, 100, 300, 500, 800];
const calculateScore = (cleared, {level}) => compose(
	multiply(inc(level)),
	nth(__, SCORE_TABLE)
)(cleared);
// FIXME this is just a mock function that calculates level from lines, not real algorithm most likely
const calculateLevel = compose(Math.floor, divide(__, 10));
// (i, j) -> l, this function got out of hand because it wants to calculate the difference of old level and new level
// so it can be added to previous level together with the other values
const calculateLevelChange = (cleared, {lines: oldLines}) =>
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
		[fullRowCount, view(lens.info.all)]
	)
);
// state -> info
const getUpdatedValues = compose(
	over(lens.info.level, clamp(0, 29)),
	converge(
		mergeWith(add),
		[getChange, view(lens.info.all)]
	)
);
// state -> state
export const updateInfo =
	converge(
		set(lens.info.all),
		[getUpdatedValues, identity]
	);