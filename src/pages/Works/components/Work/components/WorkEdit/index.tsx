import React, { useCallback, useMemo, useState } from 'react';

import { Work } from 'api/Works';
import { API } from 'api';
import { FadingMessage } from 'components/FadingMessage';
import { TextInput } from 'components/TextInput';
import { FadingMessageTypes } from 'models/Message';
import styles from './styles.module.scss';

interface Props {
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
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const WorkEdit = (props: Props) => {
  const {
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
    isLoading,
    setLoading,
  } = props;

  const [message, setMessage] = useState<{ text: string; type: FadingMessageTypes } | null>(null);

  const onChange = useCallback(
    (name: keyof Work) => (value: string) => {
      setWork({ [name]: value });
    },
    [setWork],
  );

  const changedWork = useMemo(
    () => ({
      ...(address !== initialWork?.address ? { address } : {}),
      ...(descEn !== initialWork?.descEn ? { descEn } : {}),
      ...(descDe !== initialWork?.descDe ? { descDe } : {}),
      ...(imageFile ? { imageFile } : {}),
      ...(repo !== initialWork?.repo ? { repo } : {}),
    }),
    [initialWork, address, descEn, descDe, imageFile, repo],
  );

  const isWorkChanged = useMemo(() => !!Object.keys(changedWork).length, [changedWork]);

  const updateWork = useCallback(async () => {
    if (isWorkChanged) {
      setLoading(true);
      const response = await API.Works.updateWorks({ _id, ...changedWork });
      let type: FadingMessageTypes | undefined;
      let text: string;
      if (response.status === 200 && response.data.data) {
        type = 'success';
        text = response.data.message;
        setWork({ imageFile: undefined });
        setInitialWork(response.data.data);
      } else {
        type = 'error';
        text = response.data.error?.message || `Error status: ${response.status}`;
      }
      setLoading(false);
      setMessage({ text, type });
    }
  }, [isWorkChanged, setLoading, _id, changedWork, setWork, setInitialWork]);

  const createNewWork = useCallback(async () => {
    setLoading(true);
    const response = await API.Works.updateWorks({
      address,
      descEn,
      descDe,
      imageFile,
      index,
      repo,
    });
    let type: FadingMessageTypes | undefined;
    let text: string;
    if (response.status === 200 && response.data.data) {
      type = 'success';
      text = response.data.message;
      setWork({ ...response.data.data, imageFile: undefined });
      setInitialWork(response.data.data);
    } else {
      type = 'error';
      text = response.data.error?.message || '';
    }
    setLoading(false);
    setMessage({ text, type });
  }, [setLoading, address, descEn, descDe, imageFile, index, repo, setWork, setInitialWork]);

  const closeMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const move = useCallback(
    (isMoveUp: boolean) => () => {
      if (_id) {
        changeOrder(_id, isMoveUp);
      }
    },
    [changeOrder, _id],
  );

  const isWorkEmpty = useMemo(
    () => !(imageSrc || imageFile) || !descEn || !descDe,
    [imageSrc, imageFile, descEn, descDe],
  );

  const isSaveDisabled = useMemo(
    () => !isWorkChanged || isWorkEmpty || isLoading,
    [isWorkChanged, isWorkEmpty, isLoading],
  );

  const deleteWork = useCallback(async () => {
    /* eslint-disable-next-line no-alert */
    if (_id && window.confirm(`Work with id ${_id} will be deleted.`)) {
      setLoading(true);
      const response = await API.Works.deleteWork(_id);
      if (response.status === 200) {
        getWorks();
      } else {
        setMessage({
          text: response.data.error?.message || `Error status ${response.status}`,
          type: 'error',
        });
        setLoading(false);
      }
    } else {
      deleteWorkWithoutId();
    }
  }, [_id, setLoading, getWorks, deleteWorkWithoutId]);

  return (
    <>
      <TextInput
        className="mb-3"
        label="Edit English Description"
        placeholder="english description"
        value={descEn}
        onChange={onChange('descEn')}
        isTextarea
      />
      <TextInput
        className="mb-3"
        label="Edit German Description"
        placeholder="german description"
        value={descDe}
        onChange={onChange('descDe')}
        isTextarea
      />
      <TextInput
        className="mb-3"
        label="Edit Site Address"
        placeholder="site address"
        value={address}
        onChange={onChange('address')}
      />
      <TextInput
        className="mb-3"
        label="Edit Repository Link"
        placeholder="repository link"
        value={repo}
        onChange={onChange('repo')}
      />
      <div className={styles.buttons}>
        <div className={styles.arrows}>
          <button
            className="btn _round"
            type="button"
            disabled={!_id || isFirst || isLoading}
            title="Order will be saved immediately!"
            onClick={move(true)}
          >
            &uarr;
          </button>
          <button
            className="btn _round"
            type="button"
            disabled={!_id || isLast || isLoading}
            title="Order will be saved immediately!"
            onClick={move(false)}
          >
            &darr;
          </button>
        </div>
        <button className="btn _red" type="button" onClick={deleteWork}>
          Delete
        </button>
        <button
          className="btn _green ms-3"
          type="button"
          disabled={isSaveDisabled}
          onClick={_id ? updateWork : createNewWork}
        >
          Save
        </button>
      </div>
      <FadingMessage message={message?.text} type={message?.type} close={closeMessage} />
    </>
  );
};
