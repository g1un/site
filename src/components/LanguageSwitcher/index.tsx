import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'store';
import { appActions, SetLanguage } from 'store/app/actions';
import { Languages } from 'store/app/reducers';
import { getText } from 'languages/getText';
import styles from './styles.module.scss';

interface Props extends SetLanguage {
  language: Languages;
}

const LanguageSwitcherComponent = (props: Props) => {
  const { setLanguage, language } = props;

  useEffect(() => {
    const localStorageLang = localStorage.getItem('language');
    if (localStorageLang === null) {
      if (/^de\b/.test(navigator.language)) {
        localStorage.setItem('language', 'de');
      }
    } else if (localStorageLang === 'de') {
      setLanguage('de');
    }
  }, [setLanguage]);

  const onClick = useCallback(() => {
    const newLang = language === 'en' ? 'de' : 'en';
    localStorage.setItem('language', newLang);
    setLanguage(newLang);
  }, [setLanguage, language]);

  const title = `${getText('Switch to')} ${(language === 'en' ? 'de' : 'en').toUpperCase()}`;

  return (
    <button className={`btn _round ${styles.btn}`} type="button" onClick={onClick} title={title}>
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
