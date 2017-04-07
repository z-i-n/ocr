import {
  ZOOM_SET
} from '../actions/zoom';

export function zoom(state = {
  value: 1
}, action: Object) {
  switch (action.type) {
    case ZOOM_SET:
      return Object.assign({}, state, { value: (action.zoom || 1) });
    default:
      return state;
  }
}
