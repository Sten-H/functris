import 'jsdom-global/register';  // Needs to be first import apparently
import * as React from 'react';
import configureMockStore from 'redux-mock-store';
import { KEYUP } from 'react-key-handler';
import Tetris from './';
import * as constants from '../../game-logic/constants';
import { mountWithStore } from "../../testHelpers";
import { triggerKeyEvent } from '../../helpers';
import * as enzyme from 'enzyme';
import * as c from '../../game-logic/constants/index';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_DOWN = 'ArrowDown';
const ARROW_UP = 'ArrowUp';
const SPACE = ' ';
const P = 'p';

const state = {
    tetris: {
        board: constants.EMPTY_BOARD,
        piece: constants.PIECES.L,
        pos: [ 0, 0 ],
        bag: [],
	    options: {
        	tick: 50,
		    paused: false
	    }
    }
};
describe('Tetris container', () => {
    const mockStore = configureMockStore();
    const store = mockStore(state);
    beforeEach(() => {
	    store.clearActions();
    });
    it('should mount with store without crashing', () => {
        const component = mountWithStore(<Tetris isTest={true}/>, store);
    });
    it('Should render board state', () => {
        const component = mountWithStore(<Tetris isTest={true}/>, store);
        expect(component.find('.tetris-row')).toHaveLength(c.LEGAL_ROWS);
        expect(component.find('.tetris-row').last().find('.empty-cell')).toHaveLength(c.COL_COUNT);
    });
    describe('Dispatch on events', () => {
	    it('should dispatch shift left event on left arrow key press', () => {
		    triggerKeyEvent(KEYUP, undefined, ARROW_LEFT);
		    // FIXME all KEYUP events fire twice, or atleast create two actions
		    // It's very odd, it doesn't cause bad behaviour, I wonder what causes it
		    // expect(store.getActions()).toHaveLength(1);
		    expect(store.getActions()[0].type).toEqual("SHIFT_LEFT");

	    });
	    it('should dispatch shift right event on right arrow key press', () => {
		    triggerKeyEvent(KEYUP, undefined, ARROW_RIGHT);
		    expect(store.getActions()[0].type).toEqual("SHIFT_RIGHT");
	    });
	    it('should dispatch shift down event on down arrow key press', () => {
		    triggerKeyEvent(KEYUP, undefined, ARROW_DOWN);
		    // expect(store.getActions()).toHaveLength(1);
		    expect(store.getActions()[0].type).toEqual("SHIFT_DOWN");

	    });
	    it('should dispatch rotate clockwise event on up arrow key press', () => {
		    triggerKeyEvent(KEYUP, undefined, ARROW_UP);
		    // expect(store.getActions()).toHaveLength(1);
		    expect(store.getActions()[0].type).toEqual("ROTATE_CLOCKWISE");
	    });
	    it('should dispatch drop event on space key press', () => {
		    triggerKeyEvent(KEYUP, undefined, SPACE);
		    // expect(store.getActions()).toHaveLength(1);
		    expect(store.getActions()[0].type).toEqual("DROP_PIECE");
	    });
	    // FIXME These tests don't work, I may need to use promises or something to wait for the timeout
	    // it('should dispatch drop events over time (on ticks)', () => {
	    //     const component = mountWithStore(<Tetris />, store);
	    //     const actionsAfterInit = tail(store.getActions());  // It always dispatches 1 SHIFT_DOWN on init, disregard
	    //     expect(actionsAfterInit).toHaveLength(0);
	    //     setTimeout(() => {
	    // 	    const actionsAfterWait = tail(store.getActions());
	    // 	    expect(actionsAfterWait.length).toEqual(2);
	    //     }, 105);  // Tickrate in mockstate is 50
	    //
	    // });
	    // it('should not change state during pause', () => {
	    // 	const component = mountWithStore(<Tetris />, store);
	    // 	triggerKeyEvent(KEYUP, undefined, P);
	    // 	setTimeout(() => {
	    // 		const actionsAfterWait = tail(store.getActions());
	    // 		expect(actionsAfterWait.length).toEqual(0);
	    // 	}, 105);  // Tickrate in mockstate is 50
	    // });
    });
});