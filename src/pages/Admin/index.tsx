import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { NavItem } from 'components/Nav/components/NavItem';
import { API } from 'api';
import { authActions, SetAuthorized } from 'store/auth/actions';
import { AppState } from 'store';
import { appActions, SetPageLoading } from 'store/app/actions';
import { Login } from './components/Login';

interface Props extends SetAuthorized, SetPageLoading {
  isAuthorized: boolean | null;
  children?: React.ReactElement;
}

export const AdminComponent = (props: Props) => {
  const { setPageLoading, setAuthorized, isAuthorized, children } = props;

  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (jwt) {
      (async () => {
        setPageLoading(true);
        const response = await API.Admin.checkAuth(jwt);
        if (response === 200) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
        setPageLoading(false);
      })();
    } else {
      setAuthorized(false);
      setPageLoading(false);
    }
  }, [jwt, setPageLoading, setAuthorized]);

  return isAuthorized && children ? (
    children
  ) : (
    <NavItem title="Admin" path="/admin">
      {isAuthorized ? <Navigate to="/admin/skills" /> : <Login />}
    </NavItem>
  );
};

const mapState = (state: AppState) => ({
  isAuthorized: state.auth.isAuthorized,
});

const mapActions = {
  setPageLoading: appActions.setPageLoading,
  setAuthorized: authActions.setAuthorized,
};

export const Admin = connect(mapState, mapActions)(AdminComponent);
