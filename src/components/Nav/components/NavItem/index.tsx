import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { Spinner } from 'components/Spinner';
import { AppState } from 'store';
import { appActions, SetPageLoading } from 'store/app/actions';
import styles from './styles.module.scss';

interface Props extends SetPageLoading {
  path?: string;
  title: string;
  isPageLoading: boolean;
  children: React.ReactNode;
}

const NavItemComponent = (props: Props) => {
  const { path, title, setPageLoading, isPageLoading, children } = props;

  const { pathname } = useLocation();

  const isActive = useMemo(() => (path === undefined ? true : pathname === path), [pathname, path]);

  const [isOpen, setOpen] = useState<boolean>(isActive);

  useEffect(() => {
    if (!isActive) {
      setOpen(false);
      setPageLoading(true);
    }
  }, [isActive, setPageLoading]);

  const onTransitionEnd = useCallback(() => {
    if (isActive) {
      setOpen(true);
    }
  }, [isActive]);

  return (
    <div
      className={`${styles.item} ${isActive ? styles.Active : ''}`}
      onTransitionEnd={onTransitionEnd}
    >
      <header className={styles.header}>
        {path ? (
          <NavLink
            to={path}
            className={`${styles.link} ${isActive ? styles.Active : ''}`}
            onTransitionEnd={(e) => e.stopPropagation()}
          >
            {title}
          </NavLink>
        ) : (
          <h2 className={`${styles.link} ${styles.Active}`}>{title}</h2>
        )}
      </header>
      {isActive && (
        <>
          <div className={`${styles.content} ${!isOpen || isPageLoading ? styles.Hidden : ''}`}>
            {children}
          </div>
          {(!isOpen || isPageLoading) && (
            <div className={styles.spinner}>
              <Spinner />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const mapState = (state: AppState) => ({
  isPageLoading: state.app.isPageLoading,
});

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const NavItem = connect(mapState, mapActions)(NavItemComponent);
