import * as React from 'react';
import * as enzyme from 'enzyme';
import { HighScore } from "./index";

describe('HighScore component', () => {
    it('should match snapshot', () => {
        const component = enzyme.shallow(<HighScore />);
        expect(component).toMatchSnapshot()
    })
});