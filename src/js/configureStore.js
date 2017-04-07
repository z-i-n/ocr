//@flow
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

const middleWare = [thunkMiddleware, loadingBarMiddleware()];

if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger');
  const loggerMiddleware = createLogger();
  middleWare.push(loggerMiddleware);
}
/*
const createStoreWithMiddleware = applyMiddleware(
  ...middleWare
)(createStore);

export default function configureStore(initialStore?: Object) {
  return createStoreWithMiddleware(rootReducer, initialStore);
}
*/
export default function configureStore(initialStore) {
  return createStore(
    rootReducer,
    initialStore,
    applyMiddleware(...middleWare)
  );
}