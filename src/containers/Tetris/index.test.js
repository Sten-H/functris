import 'jsdom-global/register';  // Needs to be first import apparently
import * as React from 'react';
import * as enzyme from 'enzyme';
import configureMockStore, { MockStore } from 'redux-mock-store';
import Tetris from './';
import { identity, join, repeat } from 'ramda';
import * as constants from '../../reducers/tetris/constants';


const mountWithStore = (component, store) => {
    const context = {
        store
    };
    return enzyme.mount(component, { context });
};
const state = {tetris: {board: constants.EMPTY_BOARD, piece: constants.PIECES.L, position: [0, 0]}, counter: 0};
describe('Tetris container', () => {
    const mockStore = configureMockStore();
    const store = mockStore(state);
    it('Should render board state', () => {
        const component = mountWithStore(<Tetris />, store);
        expect(component.find('.tetris-row')).toHaveLength(20);
        const expectedRow = join('', repeat(constants.EMPTY_TOKEN, 10));
        expect(component.find('.tetris-row').first().text()).toEqual(expectedRow);
    })
});