import { Action } from 'models/Action';
import { reducerFromMap } from 'utils/actions';
import { SUPPORTED_LANGUAGES } from 'components/consts';
import { appConstants } from './constants';

export type Languages = typeof SUPPORTED_LANGUAGES[number];

export interface AppState {
  isPageLoading: boolean;
  language: Languages;
}

const defaultAppState: AppState = {
  isPageLoading: false,
  language: 'en',
};

function setPageLoading(state: AppState, action: Action<boolean>): AppState {
  return { ...state, isPageLoading: action.payload };
}

function SetLanguage(state: AppState, action: Action<Languages>): AppState {
  return { ...state, language: action.payload };
}

const reducer = reducerFromMap<AppState>(defaultAppState, {
  [appConstants.SET_PAGE_LOADING]: setPageLoading,
  [appConstants.SET_LANGUAGE]: SetLanguage,
});

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const app = (state: AppState = defaultAppState, action: Action<any>) =>
  reducer(state, action);
