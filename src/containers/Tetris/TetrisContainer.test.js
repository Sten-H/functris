import 'jsdom-global/register';  // Needs to be first import apparently
import * as React from 'react';
import * as enzyme from 'enzyme';
import configureMockStore, { MockStore } from 'redux-mock-store';
import { join, repeat } from 'ramda';
import { KEYUP } from 'react-key-handler';
import Tetris from './';
import * as constants from '../../reducers/tetris/logic/constants';


function triggerKeyEvent(eventName, keyCode, keyValue = undefined) {
    const event = new window.KeyboardEvent(eventName, { keyCode, key: keyValue });
    document.dispatchEvent(event);
}
const mountWithStore = (component, store) => {
    const context = {
        store
    };
    return enzyme.mount(component, { context });
};
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const state = {
    tetris: {
        board: constants.EMPTY_BOARD,
        piece: constants.PIECES.L,
        pos: [ 0, 0 ],
        bag: [ [ [ 0, 0 ], [ 1, 0 ] ], [ [ 0, 0 ], [ 1, 0 ] ] ]
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
    it('should dispatch event on left key press', () => {
        store.clearActions();
        triggerKeyEvent(KEYUP, undefined, ARROW_LEFT);
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0].type).toEqual("SHIFT_LEFT");

    });
    it('should dispatch event on right key press', () => {
        triggerKeyEvent(KEYUP, undefined, ARROW_RIGHT);
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0].type).toEqual("SHIFT_RIGHT");
    });
});