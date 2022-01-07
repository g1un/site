import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { auth, AuthState } from './auth/reducers';
import { app, AppState as ApplicationState } from './app/reducers';

export interface AppState {
  auth: AuthState;
  app: ApplicationState;
}

const rootReducer = combineReducers({
  auth,
  app,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
