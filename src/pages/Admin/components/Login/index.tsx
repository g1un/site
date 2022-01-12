import React, { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { NavContent } from 'components/Nav/components/NavContent';
import { API } from 'api';
import { authActions, SetAuthorized } from 'store/auth/actions';
import { FadingMessage } from 'components/FadingMessage';
import { TextInput } from 'components/TextInput';
import { getText } from 'languages/getText';
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
    (key: string) => (value: string) => {
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
        <h2 className={`h2 ${styles.title}`}>{getText('Login')}</h2>
        <TextInput
          className={styles.input}
          label="Email"
          placeholder="Email"
          value={credentials.email}
          onChange={onInputChange('email')}
        />
        <TextInput
          className={styles.input}
          type="password"
          label={getText('Password')}
          placeholder={getText('Password')}
          value={credentials.password}
          onChange={onInputChange('password')}
        />
        <button className="btn" type="submit" disabled={isDisabled}>
          {getText('log in')}
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
