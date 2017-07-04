import keys from '../keys';

export const ready = function(state = false, action) {
  switch (action.type) {
    case keys.SET_READY:
      return action.ready;
    default:
      return state;
  }
};

export const windowSize = (state = {width: 1024, height: 680}, action) => {
  switch (action.type) {
    case keys.SET_WINDOW_SIZE:
      return action.windowSize;
    default:
      return state;
  }
};