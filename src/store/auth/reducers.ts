import { Action } from 'models/Action';
import { reducerFromMap } from 'utils/actions';
import { authConstants } from './constants';

export interface AuthState {
  isAuthorized: boolean | null;
}

const defaultAuthState: AuthState = {
  isAuthorized: null,
};

function setAuthorized(state: AuthState, action: Action<boolean>): AuthState {
  return { ...state, isAuthorized: action.payload };
}

const reducer = reducerFromMap<AuthState>(defaultAuthState, {
  [authConstants.SET_AUTHORIZED]: setAuthorized,
});

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const auth = (state: AuthState = defaultAuthState, action: Action<any>) =>
  reducer(state, action);
