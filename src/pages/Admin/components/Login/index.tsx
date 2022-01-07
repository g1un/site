import React, { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { NavContent } from 'components/Nav/components/NavContent';
import { API } from 'api';
import { authActions, SetAuthorized } from 'store/auth/actions';
import { FadingMessage } from 'components/FadingMessage';
import styles from './styles.module.scss';

type Props = SetAuthorized;

const LoginComponent = (props: Props) => {
  const { setAuthorized } = props;

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
        setAuthorized(true);
      } else {
        setError(message);
        setAuthorized(false);
      }
    },
    [credentials, setAuthorized],
  );

  const isDisabled = useMemo(
    () => credentials.email === '' || credentials.password === '',
    [credentials],
  );

  const hideError = useCallback(() => setError(null), []);

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
        <button className="btn" type="submit" disabled={isDisabled}>
          Login
        </button>
        <FadingMessage message={error} type="error" close={hideError} />
      </form>
    </NavContent>
  );
};

const mapActions = {
  setAuthorized: authActions.setAuthorized,
};

export const Login = connect(null, mapActions)(LoginComponent);
