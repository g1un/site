import React, { SetStateAction, useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { API } from 'api';
import { Skills } from 'api/Skills';
import { appActions, SetPageLoading } from 'store/app/actions';
import { FadingMessage } from 'components/FadingMessage';
import { TextInput } from 'components/TextInput';
import { FadingMessageTypes } from 'models/Message';
import { Languages } from 'store/app/reducers';
import { SUPPORTED_LANGUAGES } from 'components/consts';
import { LIBRARY } from 'languages/library';
import { getText } from 'languages/getText';

interface Props extends SetPageLoading {
  skills: Skills | null;
  setSkills: (skills: SetStateAction<Skills | null>) => void;
  initialSkills: Skills | null;
  getSkills: () => void;
}

const AboutEditComponent = (props: Props) => {
  const { setPageLoading, skills, setSkills, initialSkills, getSkills } = props;

  const [message, setMessage] = useState<{ text: string; type?: FadingMessageTypes } | null>(null);

  const onChange = useCallback(
    (lang: Languages) => (value: string) => {
      setSkills((prevState) => (prevState ? { ...prevState, [lang]: value } : prevState));
    },
    [setSkills],
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

  const isDisabled = useMemo(
    () =>
      !skills ||
      !initialSkills ||
      SUPPORTED_LANGUAGES.every((lang) => skills[lang] === initialSkills[lang]),
    [skills, initialSkills],
  );

  return (
    <>
      {SUPPORTED_LANGUAGES.map((lang, index) => (
        <TextInput
          key={lang}
          className={index < SUPPORTED_LANGUAGES.length - 1 ? 'mb-3' : ''}
          label={LIBRARY.Skills[lang]}
          placeholder={LIBRARY.Skills[lang]}
          value={(skills && skills[lang]) || ''}
          onChange={onChange(lang)}
          isTextarea
          textareaHeight={200}
        />
      ))}
      <button
        type="button"
        className="btn mt-3 align-self-center"
        onClick={saveSkills}
        disabled={isDisabled}
      >
        {getText('Save')}
      </button>
      <FadingMessage message={message?.text} type={message?.type} close={closeMessage} />
    </>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const AboutEdit = connect(null, mapActions)(AboutEditComponent);
