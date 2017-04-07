
import {
  OPACITY_SET
} from '../actions/opacity';

export function opacity(state = {
  value: 0.3
}, action: Object) {
  switch (action.type) {
    case OPACITY_SET:
      return Object.assign({}, state, { value: (action.opacity || 0.3) });
    default:
      return state;
  }
}
