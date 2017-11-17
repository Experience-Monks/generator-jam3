'use strict';
import { compose, applyMiddleware, createStore, combineReducers } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createHistory from 'history/{{#if pushState}}createBrowserHistory{{else}}createHashHistory{{/if}}'

import * as appReducers from './reducers/app';
import * as preloaderReducers from './reducers/preloader';
export const history = createHistory({ basename: process.env.BASENAME });

function enableBatchActions(reducers) {
  return function(state, action) {
    switch (action.type) {
      case 'BATCH_ACTIONS':
        return action.actions.reduce(reducers, state);
      default:
        return reducers(state, action);
    }
  };
}

const middleware = [routerMiddleware(history)];
const enhancers = [];
const initialState = {};

const rootReducer = combineReducers({
  ...appReducers,
  ...preloaderReducers,
  routing: routerReducer,
});

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);


export default createStore(enableBatchActions(rootReducer), initialState, composedEnhancers);
