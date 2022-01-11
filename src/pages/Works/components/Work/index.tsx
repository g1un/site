import React, { useCallback, useMemo, useState } from 'react';

import { Work } from 'api/Works';
import { API } from 'api';
import { FadingMessage } from 'components/FadingMessage';
import { Spinner } from 'components/Spinner';
import { TextInput } from 'components/TextInput';
import { FadingMessageTypes } from 'models/Message';
import styles from './styles.module.scss';

interface Props {
  isEdit?: boolean;
  _id: string | null;
  address?: string;
  descEn: string;
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
}

export const WorkItem = (props: Props) => {
  const {
    isEdit,
    _id,
    address,
    descEn,
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
  } = props;

  const origin =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : window.location.origin;

  const [message, setMessage] = useState<{ text: string; type: FadingMessageTypes } | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const descLines = useMemo(() => descEn.split('\n'), [descEn]);

  const onImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const reader = new FileReader();
        reader.onload = ({ target }) => {
          if (target?.result) {
            setWork({
              imageSrc: target.result as string,
              imageFile: (event.target.files as FileList)[0],
            });
          }
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    },
    [setWork],
  );

  const imageSrcUrl = useMemo(() => {
    // check if is base64 string
    if (/data:image\/[^;]+;base64[^"]+/i.test(imageSrc)) {
      return imageSrc;
    }
    return imageSrc ? `${origin}/${imageSrc}` : '';
  }, [origin, imageSrc]);

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
      ...(imageFile ? { imageFile } : {}),
      ...(repo !== initialWork?.repo ? { repo } : {}),
    }),
    [initialWork, address, descEn, imageFile, repo],
  );

  const isWorkChanged = useMemo(() => !!Object.keys(changedWork).length, [changedWork]);

  const updateWork = useCallback(async () => {
    if (isWorkChanged) {
      setLoading(true);
      const response = await API.Works.updateWorks({ _id, ...changedWork });
      let type: FadingMessageTypes | undefined;
      let text: string;
      if (response.status === 200 && response.data.work) {
        type = 'success';
        text = response.data.message;
        setWork({ imageFile: undefined });
        setInitialWork(response.data.work);
      } else {
        type = 'error';
        text = response.data.error?.message || `Error status: ${response.status}`;
      }
      setLoading(false);
      setMessage({ text, type });
    }
  }, [isWorkChanged, _id, changedWork, setWork, setInitialWork]);

  const createNewWork = useCallback(async () => {
    setLoading(true);
    const response = await API.Works.updateWorks({
      address,
      descEn,
      descRu: '',
      imageFile,
      index,
      repo,
    });
    let type: FadingMessageTypes | undefined;
    let text: string;
    if (response.status === 200 && response.data.work) {
      type = 'success';
      text = response.data.message;
      setWork({ ...response.data.work, imageFile: undefined });
      setInitialWork(response.data.work);
    } else {
      type = 'error';
      text = response.data.error?.message || '';
    }
    setLoading(false);
    setMessage({ text, type });
  }, [address, descEn, imageFile, index, repo, setWork, setInitialWork]);

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
    () => !(imageSrc || imageFile) || !descEn,
    [imageSrc, imageFile, descEn],
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
      let type: FadingMessageTypes | undefined;
      let text: string;
      if (response.status === 200) {
        getWorks();
      } else {
        type = 'error';
        text = response.data.error?.message || '';
        setMessage({ text, type });
        setLoading(false);
      }
    } else {
      deleteWorkWithoutId();
    }
  }, [_id, getWorks, deleteWorkWithoutId]);

  return (
    <div className={styles.container}>
      {!isEdit ? (
        <div className={styles.image}>
          <img src={`${origin}/${imageSrc}`} alt="" />
        </div>
      ) : (
        <label className={`${styles.image} ${styles.Edit} ${!imageSrcUrl ? styles.Add : ''}`}>
          <input className={styles.imageInput} type="file" onChange={onImageChange} />
          {imageSrcUrl && <img src={imageSrcUrl} alt="" />}
        </label>
      )}
      {!isEdit ? (
        <>
          <p className={`p1 ${styles.desc}`}>
            {descLines.map((line, lineIndex) => (
              <React.Fragment key={line}>
                {line}
                {lineIndex < descLines.length - 1 ? <br /> : ''}
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
        </>
      ) : (
        <>
          <TextInput
            className={styles.input}
            label="Edit Description"
            placeholder="description"
            value={descEn}
            onChange={onChange('descEn')}
            isTextarea
          />
          <TextInput
            className={styles.input}
            label="Edit Site Address"
            placeholder="site address"
            value={address}
            onChange={onChange('address')}
          />
          <TextInput
            className={styles.input}
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
            <button
              className="btn _red"
              type="button"
              // disabled={isSaveDisabled}
              onClick={deleteWork}
            >
              Delete
            </button>
            <button
              className={`btn _green ${styles.save}`}
              type="button"
              disabled={isSaveDisabled}
              onClick={_id ? updateWork : createNewWork}
            >
              Save
            </button>
          </div>
          <FadingMessage message={message?.text} type={message?.type} close={closeMessage} />
        </>
      )}
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
    </div>
  );
};
