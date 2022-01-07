import React, { useCallback, useMemo, useState } from 'react';

import { Work } from 'api/Works';
import { API } from 'api';
import { FadingMessage, FadingMessageTypes } from 'components/FadingMessage';
import { Spinner } from 'components/Spinner';
import styles from './styles.module.scss';

interface Props {
  isEdit?: boolean;
  _id: string;
  address?: string;
  descEn: string;
  imageSrc: string;
  imageFile?: File;
  repo?: string;
  setWork: (work: Partial<Work>) => void;
  initialWork?: Work;
  setInitialWork: (work: Partial<Work>) => void;
}

export const WorkItem = (props: Props) => {
  const {
    isEdit,
    _id,
    address,
    descEn,
    imageSrc,
    imageFile,
    repo,
    setWork,
    initialWork,
    setInitialWork,
  } = props;

  const origin = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

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
    return `${origin}/${imageSrc}`;
  }, [origin, imageSrc]);

  const onChange = useCallback(
    (name: keyof Work) =>
      ({ target: { value } }: { target: { value: string } }) => {
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

  const saveWork = useCallback(async () => {
    if (isWorkChanged) {
      setLoading(true);
      const response = await API.Works.updateWorks({ _id, ...changedWork });
      let type: FadingMessageTypes | undefined;
      if (response.status === 200) {
        type = 'success';
        setWork({ imageFile: undefined });
        setInitialWork(response.data.work);
      } else {
        type = 'error';
      }
      setLoading(false);
      setMessage({ text: response.data.message, type });
    }
  }, [isWorkChanged, changedWork, setInitialWork]);

  const closeMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <div className={styles.container}>
      {!isEdit ? (
        <div className={styles.image}>
          <img src={`${origin}/${imageSrc}`} alt="" />
        </div>
      ) : (
        <label className={`${styles.image} ${styles.Edit}`} htmlFor="edit-work-image">
          <input
            className={styles.imageInput}
            name="edit-work-image"
            type="file"
            onChange={onImageChange}
          />
          <img src={imageSrcUrl} alt="" />
        </label>
      )}
      {!isEdit ? (
        <>
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
        </>
      ) : (
        <>
          <span className="p1">Edit Description</span>
          <textarea
            className={styles.textarea}
            placeholder="Description"
            value={descEn}
            onChange={onChange('descEn')}
          />
          <span className="p1">Edit Site Address</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Site Address"
            value={address}
            onChange={onChange('address')}
          />
          <span className="p1">Edit Repository Link</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Repository Link"
            value={repo}
            onChange={onChange('repo')}
          />
          <div className={styles.buttons}>
            <button
              className="btn"
              type="button"
              disabled={!isWorkChanged || isLoading}
              onClick={saveWork}
            >
              Save
            </button>
          </div>
          <FadingMessage
            message={message?.text || null}
            type={message?.type}
            close={closeMessage}
          />
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
