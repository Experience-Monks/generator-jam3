'use strict';
import keys from './keys';

export const setReady = function(ready) {
  return {
    type: keys.SET_READY,
    ready
  }
};

export const setProgress = function(progress) {
  return {
    type: keys.SET_PROGRESS,
    progress
  }
};

export const setAssets = function(assets) {
  return {
    type: keys.SET_ASSETS,
    assets
  }
};