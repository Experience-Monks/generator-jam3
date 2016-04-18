'use strict';
import { createStore, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';

import * as appReducers from '../sections/App/reducers'
import DevTools from '../components/DevTools';

const reducer = combineReducers({
  ...appReducers,
  routing: routerReducer
});

export default createStore(reducer,DevTools.instrument());