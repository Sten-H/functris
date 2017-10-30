import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// FIXME app should be a component not a container as it is right now
describe('App component', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
    });
});
