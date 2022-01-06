import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { routes, Route as RouteType } from 'routes';
import { Nav } from 'components/Nav';
import { AppState } from 'store';
import 'scss/app.scss';

interface Props {
  isAuthorized: boolean;
}

const AppComponent = (props: Props) => {
  const { isAuthorized } = props;

  return (
    <BrowserRouter>
      <Routes>
        {routes
          .filter(({ isPrivate }: RouteType) => !isPrivate || isAuthorized)
          .map(({ path, component, isVisible }) => (
            <Route
              key={path}
              path={path}
              element={isVisible !== false ? <Nav>{component}</Nav> : component}
            />
          ))}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const mapState = (state: AppState) => ({
  isAuthorized: state.auth.isAuthorized,
});

export const App = connect(mapState)(AppComponent);
