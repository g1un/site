import React, { useEffect, useMemo } from 'react';

import { FadingMessageTypes } from 'models/Message';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  message?: string | null;
  type?: FadingMessageTypes;
  close: () => void;
}

export const FadingMessage = ({ className = '', message, type, close }: Props) => {
  const typeClassName = useMemo(() => {
    switch (type) {
      case 'error':
        return styles.Error;
      case 'success':
        return styles.Success;
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
  }, [message, close]);

  return !message ? null : (
    <p className={`${styles.message} ${typeClassName} ${className}`}>{message}</p>
  );
};
