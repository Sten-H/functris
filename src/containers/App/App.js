import * as React from 'react';
import { connect } from 'react-redux';
import { increment, decrement } from "../../actions/actions"
import Tetris from '../Tetris';
import './App.css';

export const App = ({counterValue, onIncrement, onDecrement}) => {
    return (
      <div className="App">
          {/*<button id="increment"*/}
                  {/*onClick={onIncrement}>INCREMENT</button>*/}
          {/*<button id="decrement"*/}
                  {/*onClick={onDecrement}>DECREMENT</button>*/}
          <h1>TETRIS</h1>
          <Tetris/>
      </div>
    );
};
const mapStateToProps = (state) => {
    return {
        counterValue: state.counter.value
    };
};

export function mapDispatchToProps(dispatch) {
    return {
        onIncrement: () => dispatch(increment()),
        onDecrement: () => dispatch(decrement())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
