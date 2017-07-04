import keys from '../keys';

const preloadList = require(`../../../raw-assets/preload.json`);

const defaultState = {
  preloader: {
    assets: preloadList,
    progress: 0,
  },
};

export const preloader = (state = defaultState.preloader, action) => {
  switch (action.type) {
    case keys.SET_ASSETS:
      return {
        ...state,
        assets: action.assets,
      };

    case keys.SET_PROGRESS:
      return {
        ...state,
        progress: action.progress,
      };

    default:
      return state;
  }
};