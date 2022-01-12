import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { NavContent } from 'components/Nav/components/NavContent';
import { Contacts as ContactsInterface } from 'api/Contacts';
import { API } from 'api';
import { appActions, SetPageLoading } from 'store/app/actions';
import { ContactsEdit } from './components/ContactsEdit';
import { ContactsTable } from './components/ContactsTable';

interface Props extends SetPageLoading {
  isEdit?: boolean;
}

export const ContactsComponent = ({ setPageLoading, isEdit }: Props) => {
  const [contacts, setContacts] = useState<ContactsInterface | null>(null);
  const [initialContacts, setInitialContacts] = useState<ContactsInterface | null>(null);

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

  return (
    <NavContent>
      {!isEdit
        ? contacts && <ContactsTable contacts={contacts} />
        : contacts &&
          initialContacts && (
            <ContactsEdit
              contacts={contacts}
              setContacts={setContacts}
              initialContacts={initialContacts}
              getContacts={getContacts}
            />
          )}
    </NavContent>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const Contacts = connect(null, mapActions)(ContactsComponent);
