import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { NavContent } from 'components/Nav/components/NavContent';
import { Contacts as ContactsInterface } from 'api/Contacts';
import { API } from 'api';
import { appActions, SetPageLoading } from 'store/app/actions';
import { TextInput } from 'components/TextInput';
import { FadingMessage } from 'components/FadingMessage';
import { FadingMessageTypes, Message } from 'models/Message';
import styles from './styles.module.scss';

const CONTACTS_MAP: { [key in keyof ContactsInterface]: string } = {
  email: 'Email',
  tel: 'Phone',
  cv: 'CV',
  github: 'Github',
};

interface Props extends SetPageLoading {
  isEdit?: boolean;
}

export const ContactsComponent = ({ setPageLoading, isEdit }: Props) => {
  const [contacts, setContacts] = useState<ContactsInterface | null>(null);
  const [initialContacts, setInitialContacts] = useState<ContactsInterface | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  const getContacts = useCallback(async () => {
    setPageLoading(true);
    const response = await API.Contacts.getContacts();
    setContacts(response);
    setInitialContacts(response);
    setPageLoading(false);
  }, [setPageLoading]);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  const onChange = useCallback(
    (name: keyof ContactsInterface) => (value: string) => {
      setContacts((prevState) =>
        prevState
          ? {
              ...prevState,
              [name]: value,
            }
          : prevState,
      );
    },
    [],
  );

  const renderValue = useCallback(
    (key: keyof ContactsInterface, value: string) => {
      if (!isEdit) {
        switch (key) {
          case 'email':
            return <a href={`mailto:${value}`}>{value}</a>;
          case 'tel':
            return <a href={`tel:${value}`}>{value}</a>;
          case 'cv':
          case 'github':
            return (
              <a href={value} target="_blank" rel="noreferrer">
                {value}
              </a>
            );
          default:
            return null;
        }
      } else {
        return <TextInput placeholder={key} value={value} onChange={onChange(key)} />;
      }
    },
    [isEdit, onChange],
  );

  const changedContacts = useMemo(
    (): Partial<ContactsInterface> =>
      contacts && initialContacts
        ? (Object.keys(contacts) as Array<keyof ContactsInterface>).reduce<
            Partial<ContactsInterface>
          >((acc, curr) => {
            if (contacts[curr] !== initialContacts[curr]) {
              acc[curr] = contacts[curr];
            }
            return acc;
          }, {})
        : {},
    [contacts, initialContacts],
  );

  const saveContacts = useCallback(async () => {
    if (Object.keys(changedContacts).length) {
      setPageLoading(true);
      const response = await API.Contacts.updateContacts(changedContacts);
      let type: FadingMessageTypes = 'success';
      let text: string;
      if (response.status === 200) {
        text = response.data.message;
        getContacts();
      } else {
        type = 'error';
        text = response.data.error?.message || `Error status: ${response.status}`;
        setPageLoading(false);
      }
      setMessage({ text, type });
    }
  }, [changedContacts, setPageLoading, getContacts]);

  const isDisabled = useMemo(() => !Object.keys(changedContacts).length, [changedContacts]);

  const closeMessage = useCallback(() => setMessage(null), []);

  const isTableVisible = useMemo(() => {
    if (isEdit) {
      return true;
    }

    return (
      !!contacts &&
      (Object.keys(contacts) as Array<keyof ContactsInterface>).some((key) => contacts[key])
    );
  }, [isEdit, contacts]);

  return (
    <NavContent>
      {isTableVisible ? (
        <>
          <table className={styles.table}>
            <tbody>
              {(Object.keys(CONTACTS_MAP) as Array<keyof ContactsInterface>).map((key) => {
                const value = contacts ? contacts[key] : '';
                return (
                  !!(isEdit || value) && (
                    <tr key={key}>
                      <td>{CONTACTS_MAP[key]}:</td>
                      <td>{renderValue(key, value)}</td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
          {isEdit && (
            <button
              className={`btn ${styles.save}`}
              type="button"
              onClick={saveContacts}
              disabled={isDisabled}
            >
              Save
            </button>
          )}
          <FadingMessage message={message?.text} type={message?.type} close={closeMessage} />
        </>
      ) : (
        <p className="p1 text-center">No data yet.</p>
      )}
    </NavContent>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const Contacts = connect(null, mapActions)(ContactsComponent);
