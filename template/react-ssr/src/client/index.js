import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory, hashHistory } from 'react-router';
import configureStore from '../shared/stores/configureStore';
import routes from '../shared/configs/routes';

const initState = window.__INITIAL_STATE__;
let store = configureStore(initState);

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('reactInit')
);