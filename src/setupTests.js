// This requestAnimationFrame is used to suppress a polyfill warning in tests.
// It is important that it is defined before enzyme is imported.
// declare const global: any;
global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
};
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() });
