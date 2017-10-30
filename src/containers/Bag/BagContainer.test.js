import 'jsdom-global/register';  // Needed for enzyme mounting
import * as React from 'react';
import * as enzyme from 'enzyme';
import configureMockStore, { MockStore } from 'redux-mock-store';
import Bag from './index';
import * as constants from "../../reducers/tetris/logic/constants/index";
import { mountWithStore } from "../../testHelpers";

const state = {
    tetris: {
        board: constants.EMPTY_BOARD,
        piece: [ [ 0, 0 ], [ 1, 0 ], [-1, 0], [-1, 1 ] ],
        pos: [0, 0],
        bag: [
            [ [ 1, 0 ], [ 0 , 1 ] ],
            [ [ 0, -1 ], [ 0 , 0 ] ],
        ]
    }
};
describe('Bag Container', () => {
    const mockStore = configureMockStore();
    const store = mockStore(state);
    it('Matches snapshot', () => {
        // const component = enzyme.mount(withStore(<Bag />, state));
        const component = mountWithStore(<Bag />, store);
        expect(component).toMatchSnapshot();
    });
});