import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { API } from 'api';
import { Work } from 'api/Works';
import { NavContent } from 'components/Nav/components/NavContent';
import { appActions, SetPageLoading } from 'store/app/actions';
import { WorkItem } from './components/Work';

interface Props extends SetPageLoading {
  isEdit?: boolean;
}

const WorksComponent = ({ isEdit, setPageLoading }: Props) => {
  const [works, setWorks] = useState<Work[] | null>(null);
  const [initialWorks, setInitialWorks] = useState<Work[] | null>(null);

  useEffect(() => {
    (async () => {
      const response = await API.Works.getWorks();
      setWorks(response);
      setInitialWorks(response);
      setPageLoading(false);
    })();
  }, [setPageLoading]);

  const setWork = useCallback(
    (_id: string, handler: Dispatch<SetStateAction<Work[] | null>>) =>
      (updatedWork: Partial<Work>) => {
        handler((prevState) =>
          prevState
            ? prevState.map((work) => {
                /* eslint-disable-next-line no-underscore-dangle */
                if (work._id === _id) {
                  return {
                    ...work,
                    ...updatedWork,
                  };
                }
                return work;
              })
            : null,
        );
      },
    [],
  );

  return (
    <NavContent>
      {works
        ?.sort((a, b) => a.index - b.index)
        .map(({ address, descEn, imageSrc, imageFile, repo, _id }) => (
          <WorkItem
            key={_id}
            isEdit={isEdit}
            _id={_id}
            address={address}
            descEn={descEn}
            imageSrc={imageSrc}
            imageFile={imageFile}
            repo={repo}
            setWork={setWork(_id, setWorks)}
            initialWork={initialWorks?.find(({ _id: initialId }) => _id === initialId)}
            setInitialWork={setWork(_id, setInitialWorks)}
          />
        ))}
    </NavContent>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const Works = connect(null, mapActions)(WorksComponent);
