import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { API } from 'api';
import { Skills } from 'api/Skills';
import { NavContent } from 'components/Nav/components/NavContent';
import { appActions, SetPageLoading } from 'store/app/actions';
import { AppState } from 'store';
import { Languages } from 'store/app/reducers';
import { SUPPORTED_LANGUAGES } from 'components/consts';
import { Placeholder } from 'components/Placeholder';
import { AboutEdit } from './components/AboutEdit';
import styles from './styles.module.scss';

interface Props extends SetPageLoading {
  isEdit?: boolean;
  language?: Languages;
}

const AboutComponent = (props: Props) => {
  const { isEdit, setPageLoading, language = 'en' } = props;

  const [skills, setSkills] = useState<Skills | null>(null);
  const [initialSkills, setInitialSkills] = useState<Skills | null>(null);

  const getSkills = useCallback(async () => {
    setPageLoading(true);
    const response = await API.Skills.getSkills();
    setSkills(response);
    setInitialSkills(response);
    setPageLoading(false);
  }, [setPageLoading]);

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  const isAnyLanguageSet = useMemo(
    () => !!skills && SUPPORTED_LANGUAGES.some((key) => !!skills[key]),
    [skills],
  );

  const renderSkills = useCallback(() => {
    if (!isAnyLanguageSet) {
      return <Placeholder type="noData" />;
    }

    if (!(skills && skills[language])) {
      return <Placeholder type="noLangData" />;
    }

    return <p className={`p1 ${styles.p}`}>{skills[language]}</p>;
  }, [isAnyLanguageSet, skills, language]);

  return (
    <NavContent>
      {!isEdit ? (
        renderSkills()
      ) : (
        <AboutEdit
          skills={skills}
          setSkills={setSkills}
          initialSkills={initialSkills}
          getSkills={getSkills}
        />
      )}
    </NavContent>
  );
};

const mapState = (state: AppState) => ({
  language: state.app.language,
});

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const About = connect(mapState, mapActions)(AboutComponent);
