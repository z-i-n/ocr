import {
  REQUEST_UPLOAD_FILE, RECEIVE_UPLOAD_FILE
} from '../actions/fileUpload';

export function uploadStatus(state = {
  isLoading: false,
  fileName: ""
}, action: Object) {
  switch (action.type) {
    case REQUEST_UPLOAD_FILE:
      return Object.assign({}, state, {
        isLoading: false
      });
    case RECEIVE_UPLOAD_FILE:
      return Object.assign({}, state, {
        isLoading: true,
        fileName: action.fileName
      });
    default:
      return false;
  }
}
