import { __, assoc, compose, curry } from "ramda";
import * as enzyme from 'enzyme';

// internal function builder
const enzymeMockBuilder = curry((func, component, store) => {
    const context = { store };
    return func(component, { context });
});

// component/container -> store -> EnzymeComp
export const mountWithStore = enzymeMockBuilder(enzyme.mount);
// component/container -> store -> EnzymeComp
export const shallowWithStore = enzymeMockBuilder(enzyme.shallow);