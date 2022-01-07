import { createAction } from 'utils/actions';
import { appConstants } from './constants';

export interface SetPageLoading {
  setPageLoading: (isPageLoading: boolean) => void;
}

export const appActions = {
  setPageLoading(isPageLoading: boolean) {
    return createAction<boolean>(appConstants.SET_PAGE_LOADING, isPageLoading);
  },
};
