import React from 'react';

import { Route, routes } from 'routes';
import { NavItem } from './components/NavItem';
import styles from './styles.module.scss';

interface Props {
  isPrivateNav?: boolean;
  children: React.ReactNode;
}

export const Nav = ({ isPrivateNav = false, children }: Props) => (
  <ul className={styles.list}>
    {routes
      .filter(
        ({ isVisible, isPrivate = false }: Route) =>
          isVisible !== false && isPrivate === isPrivateNav,
      )
      .map(({ path, title }) => (
        <NavItem key={path} path={path} title={title}>
          {children}
        </NavItem>
      ))}
  </ul>
);
