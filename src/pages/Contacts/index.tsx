import React, { useCallback, useEffect, useState } from 'react';

import { NavContent } from 'components/Nav/components/NavContent';
import { Contacts as ContactsInterface } from 'api/Contacts';
import { API } from 'api';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { appActions, SetPageLoading } from '../../store/app/actions';

const CONTACTS_MAP: { [key in keyof ContactsInterface]: string } = {
  email: 'Email',
  tel: 'Phone',
  cv: 'CV',
  github: 'Github',
};

type Props = SetPageLoading;

export const ContactsComponent = ({ setPageLoading }: Props) => {
  const [contacts, setContacts] = useState<ContactsInterface | null>(null);

  useEffect(() => {
    (async () => {
      const response = await API.Contacts.getContacts();
      setContacts(response);
      setPageLoading(false);
    })();
  }, [setPageLoading]);

  const renderValue = useCallback((key: keyof ContactsInterface, value: string) => {
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
  }, []);

  return (
    <NavContent>
      {!!contacts && (
        <table className={styles.table}>
          <tbody>
            {(Object.keys(contacts) as Array<keyof ContactsInterface>).map((key) => (
              <tr key={key}>
                <td>{CONTACTS_MAP[key]}:</td>
                <td>
                  {renderValue(
                    key,
                    !!contacts && (key === 'cv' ? contacts[key].en : contacts[key]),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </NavContent>
  );
};

const mapActions = {
  setPageLoading: appActions.setPageLoading,
};

export const Contacts = connect(null, mapActions)(ContactsComponent);
