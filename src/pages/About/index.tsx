import React, { useEffect, useState } from 'react';

import { API } from 'api';
import { Skills } from 'api/Skills';
import { NavContent } from 'components/Nav/components/NavContent';

interface Props {
  setLoaded?: (isLoaded: boolean) => void;
}

export const About = ({ setLoaded }: Props) => {
  const [skills, setSkills] = useState<Skills | null>(null);

  useEffect(() => {
    (async () => {
      const response = await API.Skills.getSkills();
      setSkills(response);
      if (setLoaded) {
        setLoaded(true);
      }
    })();
  }, [setLoaded]);

  return (
    <NavContent>
      {skills?.en.length &&
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
        })}
    </NavContent>
  );
};
