import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { NavContent } from 'components/Nav/components/NavContent';
import { API } from 'api';
import styles from './styles.module.scss';

export const Login = () => {
  const [credentials, setCredentials] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const onInputChange = useCallback(
    (key: string) =>
      ({ target: { value } }: { target: { value: string } }) => {
        setError(null);
        setCredentials((prevState) => ({
          ...prevState,
          [key]: value,
        }));
      },
    [],
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { message, token } = await API.Admin.authorize(credentials);
      if (token) {
        localStorage.setItem('jwt', token);
      } else {
        setError(message);
      }
    },
    [credentials],
  );

  const isDisabled = useMemo(
    () => credentials.email === '' || credentials.password === '',
    [credentials],
  );

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return (
    <NavContent>
      <form className={styles.container} onSubmit={onSubmit}>
        <h2 className={`h2 ${styles.title}`}>Login</h2>
        <input
          className={styles.input}
          type="text"
          placeholder="email"
          value={credentials.email}
          onChange={onInputChange('email')}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="password"
          value={credentials.password}
          onChange={onInputChange('password')}
        />
        <button type="submit" disabled={isDisabled}>
          Login
        </button>
        {error && <p className={`p1 ${styles.error}`}>{error}</p>}
      </form>
    </NavContent>
  );
};
