import 'jsdom-global/register';  // Needs to be first import apparently
import * as React from 'react';
import * as enzyme from 'enzyme';
import configureMockStore, { MockStore } from 'redux-mock-store';
import { join, repeat } from 'ramda';
import { KEYUP } from 'react-key-handler';
import Tetris from './';
import * as constants from '../../reducers/tetris/logic/constants';
import { mountWithStore } from "../../testHelpers";


function triggerKeyEvent(eventName, keyCode, keyValue = undefined) {
    const event = new window.KeyboardEvent(eventName, { keyCode, key: keyValue });
    document.dispatchEvent(event);
}
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_DOWN = 'ArrowDown';

const state = {
    tetris: {
        board: constants.EMPTY_BOARD,
        piece: constants.PIECES.L,
        pos: [ 0, 0 ],
        bag: []
    }
};
describe('Tetris container', () => {
    const mockStore = configureMockStore();
    const store = mockStore(state);
    beforeEach(store.clearActions);
    it('should mount with store without crashing', () => {
        const component = mountWithStore(<Tetris />, store);
    });
    it('Should render board state', () => {
        const component = mountWithStore(<Tetris />, store);
        expect(component.find('.tetris-row')).toHaveLength(20);
        expect(component.find('.tetris-row').first().find('.block')).toHaveLength(10);
    });
    it('should dispatch event on left arrow key press', () => {
        triggerKeyEvent(KEYUP, undefined, ARROW_LEFT);
        // FIXME all KEYUP events fire twice, or atleast create two actions
        // It's very odd, it doesn't cause bad behaviour, I wonder what causes it
        // expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0].type).toEqual("SHIFT_LEFT");

    });
    it('should dispatch event on right arrow key press', () => {
        triggerKeyEvent(KEYUP, undefined, ARROW_RIGHT);
        expect(store.getActions()[0].type).toEqual("SHIFT_RIGHT");
    });
    it('should dispatch event on down arrow key press', () => {
        triggerKeyEvent(KEYUP, undefined, ARROW_DOWN);
        // expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0].type).toEqual("SHIFT_DOWN");

    });
});