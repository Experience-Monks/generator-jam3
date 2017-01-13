'use strict';
import keys from './keys';

export const progress = function(state = 0, action) {
  switch (action.type) {
    case keys.SET_PROGRESS:
      return action.progress;
    default:
      return state
  }
};

export const ready = function(state = false, action) {
  switch (action.type) {
    case keys.SET_READY:
      return action.ready;
    default:
      return state
  }
};

const list = require('../../../raw-assets/preload.json');
export const assets = (state = list, action) => {
  switch (action.type) {
    case keys.SET_ASSETS:
      return action.assets;
    default:
      return state
  }
};