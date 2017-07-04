import keys from '../keys';

export const setAssets = function(assets) {
  return {
    type: keys.SET_ASSETS,
    assets,
  };
};

export const setProgress = function(progress) {
  return {
    type: keys.SET_PROGRESS,
    progress,
  };
};