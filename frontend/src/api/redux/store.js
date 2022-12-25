import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from 'lib/redux/reducers';
import rootSaga from 'lib/sagas';
import { composeWithDevTools } from 'redux-devtools-extension';

import { INITIAL_STATE as authenticationInitialState } from './reducers/authentication';
import { INITIAL_STATE as profileInitialState } from './reducers/profile';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['notifications', 'messages', 'modals'],
};

const initialState = {
  authentication: authenticationInitialState,
  user_profile: profileInitialState,
};

const appReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    storage.removeItem('persist:root');
    return rootReducer(initialState, action);
  }

  return rootReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(...[sagaMiddleware, logger])),
  );
  const persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};