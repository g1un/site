import React from 'react';

import { Route, routes } from 'routes';
import { NavItem } from './components/NavItem';
import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
}

export const Nav = ({ children }: Props) => (
  <ul className={styles.list}>
    {routes
      .filter(({ isVisible, isPrivate }: Route) => isVisible !== false && !isPrivate)
      .map(({ path, title }) => (
        <NavItem key={path} path={path} title={title}>
          {children}
        </NavItem>
      ))}
  </ul>
);
