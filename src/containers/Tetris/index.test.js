import 'jsdom-global/register';  // Needs to be first import apparently
import * as React from 'react';
import * as enzyme from 'enzyme';
import configureMockStore, { MockStore } from 'redux-mock-store';
import { join, repeat } from 'ramda';
import { KEYUP } from 'react-key-handler';
import Tetris from './';
import * as constants from '../../reducers/tetris/constants';


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
const state = {tetris: {board: constants.EMPTY_BOARD, piece: constants.PIECES.L, position: [0, 0]}, counter: 0};
describe('Tetris container', () => {
    const mockStore = configureMockStore();
    const store = mockStore(state);
    const component = mountWithStore(<Tetris />, store);
    beforeEach(store.clearActions);
    it('Should render board state', () => {
        expect(component.find('.tetris-row')).toHaveLength(20);
        const expectedRow = join('', repeat(constants.EMPTY_TOKEN, 10));
        expect(component.find('.tetris-row').first().text()).toEqual(expectedRow);
    });
    it('should dispatch event on left key press', () => {
        triggerKeyEvent(KEYUP, undefined, ARROW_LEFT);
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0].type).toEqual("SHIFT_LEFT");

    });
    it('should dispatch event on right key press', () => {
        triggerKeyEvent(KEYUP, undefined, ARROW_RIGHT);
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0].type).toEqual("SHIFT_RIGHT");
    })
});