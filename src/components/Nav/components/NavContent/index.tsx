import React from 'react';

import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
}

export const NavContent = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);
