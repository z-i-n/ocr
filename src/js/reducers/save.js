import {
  SAVE_DO
} from '../actions/save';

export function save(state = false, action) {
  console.log(action);
  switch (action.type) {
    case SAVE_DO:
      return true;
    default:
      return false;
  }
}
