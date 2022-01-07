import React, { useEffect, useState } from 'react';

import { API } from 'api';
import { Work } from 'api/Works';
import { NavContent } from 'components/Nav/components/NavContent';
import { connect } from 'react-redux';
import { WorkItem } from './components/Work';
import { appActions, SetPageLoading } from '../../store/app/actions';

type Props = SetPageLoading;

const WorksComponent = ({ setPageLoading }: Props) => {
  const [works, setWorks] = useState<Work[] | null>(null);

  useEffect(() => {
    (async () => {
      const response = await API.Works.getWorks();
      setWorks(response);
      setPageLoading(false);
    })();
  }, [setPageLoading]);

  return (
    <NavContent>
      {works
        ?.sort((a, b) => a.index - b.index)
        .map(({ address, descEn, imageSrc, repo, _id }) => (
          <WorkItem key={_id} address={address} descEn={descEn} imageSrc={imageSrc} repo={repo} />
        ))}
    </NavContent>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const Works = connect(null, mapActions)(WorksComponent);
