import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from "./reducers"
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from "redux-thunk";

import 'bootstrap/dist/css/bootstrap.css'
import './index.css';

const store = createStore(rootReducer, applyMiddleware(thunk));
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
