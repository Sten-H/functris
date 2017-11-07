import * as React from 'react';
import * as enzyme from 'enzyme';
import { PauseModal }from './index';
describe('GameOverModal component', () => {
	it('Should match snapshot', () => {
		const component = enzyme.shallow(<PauseModal />);
		expect(component).toMatchSnapshot();
	});
});