import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { API } from 'api';
import { Work } from 'api/Works';
import { NavContent } from 'components/Nav/components/NavContent';
import { appActions, SetPageLoading } from 'store/app/actions';
import { WorkItem } from './components/Work';
import styles from './styles.module.scss';

interface Props extends SetPageLoading {
  isEdit?: boolean;
}

const WorksComponent = ({ isEdit, setPageLoading }: Props) => {
  const [works, setWorks] = useState<Work[] | null>(null);
  const [initialWorks, setInitialWorks] = useState<Work[] | null>(null);

  const getWorks = useCallback(async () => {
    setPageLoading(true);
    const response = await API.Works.getWorks();
    setWorks(response.sort((a, b) => a.index - b.index));
    setInitialWorks(response.sort((a, b) => a.index - b.index));
    setPageLoading(false);
  }, [setPageLoading]);

  useEffect(() => {
    getWorks();
  }, [getWorks]);

  const setWork = useCallback(
    (i: number, handler: Dispatch<SetStateAction<Work[] | null>>) =>
      (updatedWork: Partial<Work>) => {
        handler((prevState) =>
          prevState
            ? [
                ...prevState.slice(0, i),
                { ...prevState[i], ...updatedWork },
                ...prevState.slice(i + 1),
              ]
            : null,
        );
      },
    [],
  );

  const changeOrder = useCallback(
    async (id: string, isMoveUp: boolean) => {
      if (works?.length) {
        /* eslint-disable no-underscore-dangle */
        const index = works.findIndex((work) => work._id === id);
        const prev = isMoveUp ? id : works[index + 1]._id;
        const next = isMoveUp ? works[index - 1]._id : id;
        /* eslint-enable no-underscore-dangle */
        if (prev && next) {
          setPageLoading(true);
          const response = await API.Works.updateWorksOrder({ prev, next });
          if (response.status === 200) {
            // @todo message is to be moved to app message popup in future
            /* eslint-disable-next-line no-console */
            console.log(response.data.message);
            getWorks();
          } else {
            // @todo message is to be moved to app message popup in future
            /* eslint-disable-next-line no-console */
            console.warn(response.data.message);
            setPageLoading(false);
          }
        }
      }
    },
    [works, setPageLoading, getWorks],
  );

  const addWork = useCallback(() => {
    const newIndex = works?.length ? Math.max(...works.map(({ index }) => index)) + 1 : 0;
    setWorks([
      ...(works || []),
      {
        address: '',
        descEn: '',
        descRu: '',
        imageSrc: '',
        index: newIndex,
        repo: '',
        _id: null,
      },
    ]);
  }, [works]);

  return (
    <NavContent>
      {works?.map(({ address, descEn, imageSrc, imageFile, repo, _id }, i) => (
        <WorkItem
          key={_id}
          isEdit={isEdit}
          _id={_id}
          address={address}
          descEn={descEn}
          imageSrc={imageSrc}
          imageFile={imageFile}
          index={i}
          repo={repo}
          setWork={setWork(i, setWorks)}
          initialWork={(initialWorks as Work[])?.find(({ _id: initialId }) => _id === initialId)}
          setInitialWork={setWork(i, setInitialWorks)}
          isFirst={i === 0}
          /* eslint-disable-next-line no-underscore-dangle */
          isLast={i === (works || []).length - 1 || !(works || [])[i + 1]._id}
          changeOrder={changeOrder}
        />
      ))}
      <button className={`btn _round ${styles.add}`} type="button" onClick={addWork}>
        +
      </button>
    </NavContent>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const Works = connect(null, mapActions)(WorksComponent);
