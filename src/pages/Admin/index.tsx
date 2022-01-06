import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { NavItem } from 'components/Nav/components/NavItem';
import { API } from 'api';
import { authActions, SetAuthorized } from 'store/auth/actions';
import { AppState } from 'store';
import { Login } from './components/Login';

interface Props extends SetAuthorized {
  isAuthorized: boolean;
}

export const AdminComponent = (props: Props) => {
  const { setAuthorized, isAuthorized } = props;

  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (jwt) {
      (async () => {
        const response = await API.Admin.checkAuth(jwt);
        if (response === 200) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })();
    }
  }, [setAuthorized, jwt]);

  return (
    <NavItem hasNoLoading title="Admin" path="/admin">
      {isAuthorized ? <>Control Panel</> : <Login />}
    </NavItem>
  );
};

const mapState = (state: AppState) => ({
  isAuthorized: state.auth.isAuthorized,
});

const mapActions = {
  setAuthorized: authActions.setAuthorized,
};

export const Admin = connect(mapState, mapActions)(AdminComponent);
