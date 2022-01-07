import { Action } from 'models/Action';
import { reducerFromMap } from 'utils/actions';
import { appConstants } from './constants';

export interface AppState {
  isPageLoading: boolean;
}

const defaultAppState: AppState = {
  isPageLoading: false,
};

function setPageLoading(state: AppState, action: Action<boolean>): AppState {
  return { ...state, isPageLoading: action.payload };
}

const reducer = reducerFromMap<AppState>(defaultAppState, {
  [appConstants.SET_PAGE_LOADING]: setPageLoading,
});

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const app = (state: AppState = defaultAppState, action: Action<any>) =>
  reducer(state, action);
