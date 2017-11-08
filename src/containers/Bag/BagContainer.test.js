import 'jsdom-global/register';  // Needed for enzyme mounting
import * as React from 'react';
import configureMockStore, { MockStore } from 'redux-mock-store';
import Bag from './index';
import * as constants from "../../tetris-logic/game-logic/constants/index";
import { mountWithStore } from "../../testHelpers";

const state = {
    tetris: {
        board: constants.EMPTY_BOARD,
        piece: {coords: [ [ 0, 0 ], [ 1, 0 ], [-1, 0], [-1, 1 ] ], token: 'X' },
        pos: [0, 0],
        bag: [
            { coords: [ [ 1, 0 ], [ 0 , 1 ] ], token: 'X' },
            { coords: [ [ 0, -1 ], [ 0 , 0 ] ], token: 'X' } ,
        ],
        options: {shadow: false}
    }
};
describe('Bag Container', () => {
    const mockStore = configureMockStore();
    const store = mockStore(state);
    it('Matches snapshot', () => {
        const component = mountWithStore(<Bag />, store);
        expect(component).toMatchSnapshot();
    });
});