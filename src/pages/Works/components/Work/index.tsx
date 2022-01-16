import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { Work } from 'api/Works';
import { Spinner } from 'components/Spinner';
import { Languages } from 'store/app/reducers';
import { AppState } from 'store';
import { getText } from 'languages/getText';
import { WorkEdit } from './components/WorkEdit';
import styles from './styles.module.scss';

interface Props {
  isEdit?: boolean;
  _id: string | null;
  address?: string;
  descEn: string;
  descDe: string;
  imageSrc: string;
  imageFile?: File;
  index: number;
  repo?: string;
  setWork: (work: Partial<Work>) => void;
  initialWork?: Work;
  setInitialWork: (work: Partial<Work>) => void;
  isFirst: boolean;
  isLast: boolean;
  changeOrder: (id: string, isMoveUp: boolean) => void;
  getWorks: () => void;
  deleteWorkWithoutId: () => void;
  language: Languages;
}

const WorkItemComponent = (props: Props) => {
  const {
    isEdit,
    _id,
    address,
    descEn,
    descDe,
    imageSrc,
    imageFile,
    index,
    repo,
    setWork,
    initialWork,
    setInitialWork,
    isFirst,
    isLast,
    changeOrder,
    getWorks,
    deleteWorkWithoutId,
    language,
  } = props;

  const [isLoading, setLoading] = useState<boolean>(false);

  const descLines = useMemo(() => {
    const desc = language === 'en' ? descEn : descDe;
    return desc?.split('\n');
  }, [language, descEn, descDe]);

  return (
    <div className={styles.container}>
      {!isEdit ? (
        <>
          <div className={styles.image}>
            <img src={imageSrc} alt="" />
          </div>
          {descLines && (
            <p className="p1 mb-3">
              {descLines.map((line, lineIndex, array) => (
                <React.Fragment key={line}>
                  {line}
                  {lineIndex < array.length - 1 ? <br /> : ''}
                </React.Fragment>
              ))}
            </p>
          )}
          {address && (
            <a target="_blank" href={address} rel="noreferrer">
              {getText('Site Link')}
            </a>
          )}
          {repo && (
            <a target="_blank" href={repo} rel="noreferrer">
              Repo Link
            </a>
          )}
        </>
      ) : (
        <WorkEdit
          _id={_id}
          address={address}
          descEn={descEn}
          descDe={descDe}
          imageSrc={imageSrc}
          imageFile={imageFile}
          index={index}
          repo={repo}
          setWork={setWork}
          initialWork={initialWork}
          setInitialWork={setInitialWork}
          isFirst={isFirst}
          isLast={isLast}
          changeOrder={changeOrder}
          getWorks={getWorks}
          deleteWorkWithoutId={deleteWorkWithoutId}
          isLoading={isLoading}
          setLoading={setLoading}
        />
      )}
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
    </div>
  );
};

const mapState = (state: AppState) => ({
  language: state.app.language,
});

export const WorkItem = connect(mapState)(WorkItemComponent);
