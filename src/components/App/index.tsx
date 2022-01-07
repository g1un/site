import React, { useMemo } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { routes, Route as RouteType } from 'routes';
import { Nav } from 'components/Nav';
import { AppState } from 'store';
import 'scss/app.scss';

interface Props {
  isAuthorized: boolean | null;
}

const AppComponent = (props: Props) => {
  const { isAuthorized } = props;

  const currentRoutes = useMemo(
    () => routes.filter(({ isPrivate }: RouteType) => isAuthorized !== false || !isPrivate),
    [isAuthorized],
  );

  return (
    <BrowserRouter>
      <Routes>
        {currentRoutes.map(({ path, component, isVisible, isPrivate }) => (
          <Route
            key={path}
            path={path}
            element={
              isVisible !== false ? <Nav isPrivateNav={isPrivate}>{component}</Nav> : component
            }
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
