//@flow
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { jsonData } from './reducers/ocrData';
import { uploadStatus } from './reducers/fileUpload';
import { opacity } from './reducers/opacity';
import { zoom } from './reducers/zoom';
import { save } from './reducers/save';
import { fileList } from './reducers/fileList';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

const rootReducer = combineReducers({
  jsonData,
  opacity,
  zoom,
  loadingBar,
  save,
  uploadStatus,
  fileList,
  routing: routerReducer
});

export default rootReducer;
