import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { API } from 'api';
import { Skills } from 'api/Skills';
import { NavContent } from 'components/Nav/components/NavContent';
import { appActions, SetPageLoading } from 'store/app/actions';
import { FadingMessage } from 'components/FadingMessage';
import { TextInput } from 'components/TextInput';
import { FadingMessageTypes } from 'models/Message';
import { AppState } from 'store';
import { Languages } from 'store/app/reducers';
import { SUPPORTED_LANGUAGES } from 'components/consts';
import { LIBRARY } from 'languages/library';
import styles from './styles.module.scss';

interface Props extends SetPageLoading {
  isEdit?: boolean;
  language?: Languages;
}

const AboutComponent = (props: Props) => {
  const { isEdit, setPageLoading, language = 'en' } = props;

  const [skills, setSkills] = useState<Skills | null>(null);
  const [initialSkills, setInitialSkills] = useState<Skills | null>(null);
  const [message, setMessage] = useState<{ text: string; type?: FadingMessageTypes } | null>(null);

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

  const onChange = useCallback(
    (lang: Languages) => (value: string) => {
      setSkills((prevState) => ({ ...(prevState || {}), [lang]: value }));
    },
    [],
  );

  const saveSkills = useCallback(async () => {
    if (skills) {
      setPageLoading(true);
      const response = await API.Skills.updateSkills(skills);
      let type: FadingMessageTypes = 'success';
      if (response.status === 200) {
        getSkills();
      } else {
        type = 'error';
        setPageLoading(false);
      }
      setMessage({ text: response.data.message, type });
    }
  }, [skills, setPageLoading, getSkills]);

  const closeMessage = useCallback(() => setMessage(null), []);

  const skillsKeys: Languages[] = useMemo(() => Object.keys(skills || []) as Languages[], [skills]);

  const isAnyLanguageSet = useMemo(
    () => !!skills && !!skillsKeys.length && skillsKeys.some((key) => !!skills[key]),
    [skills, skillsKeys],
  );

  const skillsText: React.ReactElement | null = useMemo(() => {
    if (skills && skillsKeys.length && skills[language]) {
      return (
        <>
          {(skills[language] as string).split('\n').map((row, index, array) => (
            <React.Fragment key={row}>
              {row}
              {index < array.length - 1 ? <br /> : ''}
            </React.Fragment>
          ))}
        </>
      );
    }
    return null;
  }, [skills, skillsKeys, language]);

  const isDisabled = useMemo(
    () =>
      (isEdit && !skills) ||
      !skillsKeys.length ||
      skillsKeys.every((lang) => skills && initialSkills && skills[lang] === initialSkills[lang]),
    [isEdit, skills, skillsKeys, initialSkills],
  );

  return (
    <NavContent>
      {/* eslint-disable no-nested-ternary */}
      {!isEdit ? (
        isAnyLanguageSet ? (
          skillsText ? (
            <p>{skillsText}</p>
          ) : (
            <p className="p1 text-center">No data in this language yet. Try to switch language.</p>
          )
        ) : (
          <p className="p1 text-center">No data yet.</p>
        )
      ) : (
        <>
          {SUPPORTED_LANGUAGES.map((lang, index) => (
            <TextInput
              key={lang}
              className={index < SUPPORTED_LANGUAGES.length - 1 ? 'mb-3' : ''}
              label={LIBRARY.Skills[lang]}
              placeholder={LIBRARY.skills[lang]}
              value={(skills && skills[lang]) || ''}
              onChange={onChange(lang)}
              isTextarea
              textareaHeight={200}
            />
          ))}
          <button
            type="button"
            className={`btn ${styles.save}`}
            onClick={saveSkills}
            disabled={isDisabled}
          >
            {LIBRARY.Save[language]}
          </button>
          <FadingMessage message={message?.text} type={message?.type} close={closeMessage} />
        </>
      )}
      {/* eslint-enable no-nested-ternary */}
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
