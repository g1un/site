import React, { useMemo } from 'react';

import styles from './styles.module.scss';

interface Props {
  address?: string;
  descEn: string;
  imageSrc: string;
  repo?: string;
}

export const WorkItem = (props: Props) => {
  const { address, descEn, imageSrc, repo } = props;
  const origin = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

  const descLines = useMemo(() => descEn.split('\n'), [descEn]);

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src={`${origin}/${imageSrc}`} alt="" />
      </div>
      <p className={`p1 ${styles.desc}`}>
        {descLines.map((line, index) => (
          <React.Fragment key={line}>
            {line}
            {index < descLines.length - 1 ? <br /> : ''}
          </React.Fragment>
        ))}
      </p>
      {address && (
        <a target="_blank" href={address} rel="noreferrer">
          Site Link
        </a>
      )}
      {repo && (
        <a target="_blank" href={repo} rel="noreferrer">
          Repo Link
        </a>
      )}
    </div>
  );
};
