import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { API } from 'api';
import { Skills } from 'api/Skills';
import { NavContent } from 'components/Nav/components/NavContent';
import { appActions, SetPageLoading } from 'store/app/actions';
import { FadingMessage } from 'components/FadingMessage';
import { TextInput } from 'components/TextInput';
import { FadingMessageTypes } from 'models/Message';
import styles from './styles.module.scss';

interface Props extends SetPageLoading {
  isEdit?: boolean;
}

const AboutComponent = (props: Props) => {
  const { isEdit, setPageLoading } = props;

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

  const onChange = useCallback((value: string) => {
    setSkills({ en: [value] });
  }, []);

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

  const isDisabled = useMemo(() => skills?.en[0] === initialSkills?.en[0], [skills, initialSkills]);

  const skillsRows = useMemo(() => (skills?.en.length ? skills.en[0].split('\n') : []), [skills]);

  return (
    <NavContent>
      {skills?.en.length && !isEdit ? (
        <p>
          {skillsRows.map((row, index) => (
            <React.Fragment key={row}>
              {row}
              {index < skillsRows.length - 1 ? <br /> : ''}
            </React.Fragment>
          ))}
        </p>
      ) : (
        <>
          <TextInput
            label="Skills"
            placeholder="skills"
            value={skills?.en[0] || ''}
            onChange={onChange}
            isTextarea
            textareaHeight={200}
          />
          <button
            type="button"
            className={`btn ${styles.save}`}
            onClick={saveSkills}
            disabled={isDisabled}
          >
            Save
          </button>
          <FadingMessage message={message?.text} type={message?.type} close={closeMessage} />
        </>
      )}
    </NavContent>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const About = connect(null, mapActions)(AboutComponent);
