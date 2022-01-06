import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './styles.module.scss';
import { Spinner } from '../../../Spinner';

interface Props {
  path: string;
  title: string;
  hasNoLoading?: boolean;
  children: React.ReactNode;
}

export const NavItem = ({ path, title, hasNoLoading, children }: Props) => {
  const { pathname } = useLocation();

  const isActive = useMemo(() => pathname === path, [pathname, path]);

  const [isOpen, setOpen] = useState<boolean>(isActive);
  const [isLoaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive) {
      setOpen(false);
      setLoaded(false);
    }
  }, [isActive]);

  const onTransitionEnd = useCallback(() => {
    if (isActive) {
      setOpen(true);
    }
  }, [isActive]);

  return (
    <li
      className={`${styles.item} ${isActive ? styles.Active : ''}`}
      onTransitionEnd={onTransitionEnd}
    >
      <header className={styles.header}>
        <NavLink
          to={path}
          className={`${styles.link} ${isActive ? styles.Active : ''}`}
          onTransitionEnd={(e) => e.stopPropagation()}
        >
          {title}
        </NavLink>
      </header>
      {(hasNoLoading || isActive) && (
        <>
          <div
            className={`${styles.content} ${
              !hasNoLoading && (!isOpen || !isLoaded) ? styles.Hidden : ''
            }`}
          >
            {React.Children.map(children, (child) =>
              React.isValidElement(child) ? React.cloneElement(child, { setLoaded }) : null,
            )}
          </div>
          {!hasNoLoading && (!isOpen || !isLoaded) && (
            <div className={styles.spinner}>
              <Spinner />
            </div>
          )}
        </>
      )}
    </li>
  );
};
