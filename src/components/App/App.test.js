import * as React from 'react';
import { App, InfoBoxOuter } from './App';
import * as enzyme from 'enzyme';
describe('App component', () => {
    it('Should match snapshot', () => {
        const component = enzyme.shallow(<App />);
        expect(component).toMatchSnapshot();
    });
});
