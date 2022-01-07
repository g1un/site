import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { API } from 'api';
import { Skills } from 'api/Skills';
import { NavContent } from 'components/Nav/components/NavContent';
import { appActions, SetPageLoading } from 'store/app/actions';
import styles from './styles.module.scss';
import { FadingMessage } from '../../components/FadingMessage';

interface Props extends SetPageLoading {
  isEdit?: boolean;
}

const AboutComponent = (props: Props) => {
  const { isEdit, setPageLoading } = props;

  const [skills, setSkills] = useState<Skills | null>(null);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);

  useEffect(() => {
    (async () => {
      const response = await API.Skills.getSkills();
      setSkills(response);
      setPageLoading(false);
    })();
  }, [setPageLoading]);

  const onChange = useCallback(({ target: { value } }: { target: { value: string } }) => {
    setSkills({ en: [value] });
  }, []);

  const saveSkills = useCallback(async () => {
    if (skills) {
      const response = await API.Skills.updateSkills(skills);
      let type = '';
      if (response.status !== 200) {
        type = 'error';
      }
      setMessage({ text: response.data.message, type });
    }
  }, [skills]);

  const closeMessage = useCallback(() => setMessage(null), []);

  return (
    <NavContent>
      {skills?.en.length && !isEdit ? (
        skills.en.map((skill) => {
          const skillsRows = skill.split('\n');
          return (
            <p key={skill}>
              {skillsRows.map((row, index) => (
                <React.Fragment key={row}>
                  {row}
                  {index < skillsRows.length - 1 ? <br /> : ''}
                </React.Fragment>
              ))}
            </p>
          );
        })
      ) : (
        <>
          <textarea
            className={styles.textarea}
            placeholder="Edit skills"
            value={skills?.en[0] || ''}
            onChange={onChange}
          />
          <button type="button" className={styles.save} onClick={saveSkills}>
            Save
          </button>
          <FadingMessage
            message={message?.text || null}
            type={message?.type}
            close={closeMessage}
          />
        </>
      )}
    </NavContent>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const About = connect(null, mapActions)(AboutComponent);
