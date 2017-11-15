'use strict';
import { createStore, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';

import * as appReducers from './reducers/app';
import * as preloaderReducers from './reducers/preloader';

const reducers = combineReducers({
  ...appReducers,
  ...preloaderReducers,
  routing: routerReducer,
});

const enhancer = (process.env.NODE_ENV === 'development' && window.devToolsExtension) ? window.devToolsExtension() : f => f;

export default createStore(reducers, enhancer);
