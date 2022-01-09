import React, { HTMLInputTypeAttribute, useCallback } from 'react';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
  onChange: (value: string) => void;
  isTextarea?: boolean;
  textareaHeight?: number;
}

export const TextInput = (props: Props) => {
  const {
    className = '',
    label,
    placeholder,
    type = 'text',
    value,
    onChange,
    isTextarea,
    textareaHeight = 8 * 16,
  } = props;

  const handleOnChange = useCallback(
    ({ target: { value: targetValue } }: { target: { value: string } }) => {
      onChange(targetValue);
    },
    [onChange],
  );

  return (
    <div className={`${styles.container} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}
      {React.createElement(!isTextarea ? 'input' : 'textarea', {
        className: `${styles.input} ${isTextarea ? styles.textarea : ''}`,
        ...(!isTextarea ? { type } : { style: { height: `${textareaHeight / 16}rem` } }),
        placeholder,
        value,
        onChange: handleOnChange,
      })}
    </div>
  );
};
