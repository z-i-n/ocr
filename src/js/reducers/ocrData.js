
import {
  REQUEST_DATA, RECEIVE_DATA
} from '../actions/ocrData';

export function jsonData(state = {
  isLoading: false,
  data: {}
}, action: Object) {
  switch (action.type) {
    case RECEIVE_DATA:
      return Object.assign({}, state, {
        isLoading: true,
        data: action.data
      });
    case REQUEST_DATA:
      return Object.assign({}, state, {
        isLoading: false,
        data: {}
      });
    default:
      return state;
  }
}
