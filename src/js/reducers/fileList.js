
import {
  REQUEST_LIST_DATA, RECEIVE_LIST_DATA
} from '../actions/fileList';

export function fileList(state = {
  isLoading: false,
  list: []
}, action: Object) {
  switch (action.type) {
    case REQUEST_LIST_DATA:
      return Object.assign({}, state, {
        isLoading: true
      });
    case RECEIVE_LIST_DATA:
      return Object.assign({}, state, {
        isLoading: false,
        list: action.list
      });
    default:
      return state;
  }
}
