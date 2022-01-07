import React, { useEffect, useMemo } from 'react';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  message: string | null;
  type?: string;
  close: () => void;
}

export const FadingMessage = ({ className = '', message, type, close }: Props) => {
  const typeClassName = useMemo(() => {
    switch (type) {
      case 'error':
        return styles.Error;
      default:
        return '';
    }
  }, [type]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        close();
      }, 5000);
    }
  }, [message]);

  return !message ? null : (
    <p className={`${styles.message} ${typeClassName} ${className}`}>{message}</p>
  );
};
