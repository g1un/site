import React, { SetStateAction, useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { Contacts } from 'api/Contacts';
import { API } from 'api';
import { appActions, SetPageLoading } from 'store/app/actions';
import { FadingMessage } from 'components/FadingMessage';
import { FadingMessageTypes, Message } from 'models/Message';
import { getText } from 'languages/getText';
import { ContactsTable } from '../ContactsTable';

interface Props extends SetPageLoading {
  contacts: Contacts;
  setContacts: (contacts: SetStateAction<Contacts | null>) => void;
  initialContacts: Contacts;
  getContacts: () => void;
}

export const ContactsEditComponent = (props: Props) => {
  const { setPageLoading, contacts, setContacts, initialContacts, getContacts } = props;

  const [message, setMessage] = useState<Message | null>(null);

  const onChange = useCallback(
    (name: keyof Contacts) => (value: string) => {
      setContacts((prevState) =>
        prevState
          ? {
              ...prevState,
              [name]: value,
            }
          : prevState,
      );
    },
    [setContacts],
  );

  const changedContacts = useMemo(
    (): Partial<Contacts> =>
      contacts && initialContacts
        ? (Object.keys(contacts) as Array<keyof Contacts>).reduce<Partial<Contacts>>(
            (acc, curr) => {
              if (contacts[curr] !== initialContacts[curr]) {
                acc[curr] = contacts[curr];
              }
              return acc;
            },
            {},
          )
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

  return (
    <>
      <ContactsTable isEdit contacts={contacts} onChange={onChange} />
      <button
        className="btn align-self-center"
        type="button"
        onClick={saveContacts}
        disabled={isDisabled}
      >
        {getText('Save')}
      </button>
      <FadingMessage message={message?.text} type={message?.type} close={closeMessage} />
    </>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const ContactsEdit = connect(null, mapActions)(ContactsEditComponent);
