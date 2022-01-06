import React, { useEffect, useState } from 'react';

import { API } from 'api';
import { Work } from 'api/Works';
import { NavContent } from 'components/Nav/components/NavContent';
import { WorkItem } from './components/Work';

interface Props {
  setLoaded?: (isLoaded: boolean) => void;
}

export const Works = ({ setLoaded }: Props) => {
  const [works, setWorks] = useState<Work[] | null>(null);

  useEffect(() => {
    (async () => {
      const response = await API.Works.getWorks();
      setWorks(response);
      if (setLoaded) {
        setLoaded(true);
      }
    })();
  }, [setLoaded]);

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
