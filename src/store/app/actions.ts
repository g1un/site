import { createAction } from 'utils/actions';
import { appConstants } from './constants';
import { Languages } from './reducers';

export interface SetPageLoading {
  setPageLoading: (isPageLoading: boolean) => void;
}

export interface SetLanguage {
  setLanguage: (language: Languages) => void;
}

export const appActions = {
  setPageLoading(isPageLoading: boolean) {
    return createAction<boolean>(appConstants.SET_PAGE_LOADING, isPageLoading);
  },
  setLanguage(language: Languages) {
    return createAction<Languages>(appConstants.SET_LANGUAGE, language);
  },
};
