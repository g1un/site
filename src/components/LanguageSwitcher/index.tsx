import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'store';
import { appActions, SetLanguage } from 'store/app/actions';
import { Languages } from 'store/app/reducers';
import styles from './styles.module.scss';

interface Props extends SetLanguage {
  language: Languages;
}

const LanguageSwitcherComponent = (props: Props) => {
  const { setLanguage, language } = props;

  const onClick = useCallback(
    () => setLanguage(language === 'en' ? 'de' : 'en'),
    [setLanguage, language],
  );

  return (
    <button className={`btn _round ${styles.btn}`} type="button" onClick={onClick}>
      {language.toUpperCase()}
    </button>
  );
};

const mapState = (state: AppState) => ({
  language: state.app.language,
});

const mapActions = {
  setLanguage: appActions.setLanguage,
};

export const LanguageSwitcher = connect(mapState, mapActions)(LanguageSwitcherComponent);
