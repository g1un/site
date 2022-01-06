import { createAction } from 'utils/actions';
import { authConstants } from './constants';

export interface SetAuthorized {
  setAuthorized: (isAuthorized: boolean) => void;
}

export const authActions = {
  setAuthorized(isAuthorized: boolean) {
    return createAction<boolean>(authConstants.SET_AUTHORIZED, isAuthorized);
  },
};
