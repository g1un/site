import React, { useCallback, useMemo } from 'react';

import { Contacts } from 'api/Contacts';
import { TextInput } from 'components/TextInput';
import { Placeholder } from 'components/Placeholder';
import styles from './styles.module.scss';

export const CONTACTS_MAP: { [key in keyof Contacts]: string } = {
  email: 'Email',
  tel: 'Tel',
  cv: 'CV',
  github: 'Github',
};

interface Props {
  isEdit?: boolean;
  onChange?: (name: keyof Contacts) => (value: string) => void;
  contacts: Contacts;
}

export const ContactsTable = ({ isEdit, onChange, contacts }: Props) => {
  const isTableVisible = useMemo(
    () => isEdit || (Object.keys(contacts) as Array<keyof Contacts>).some((key) => contacts[key]),
    [isEdit, contacts],
  );

  const renderValue = useCallback(
    (key: keyof Contacts, value: string) => {
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
        return !!onChange && <TextInput placeholder={key} value={value} onChange={onChange(key)} />;
      }
    },
    [isEdit, onChange],
  );

  return isTableVisible ? (
    <table className={styles.table}>
      <tbody>
        {(Object.keys(CONTACTS_MAP) as Array<keyof Contacts>).map(
          (key) =>
            !!(isEdit || contacts[key]) && (
              <tr key={key}>
                <td>{CONTACTS_MAP[key]}:</td>
                <td>{renderValue(key, contacts[key])}</td>
              </tr>
            ),
        )}
      </tbody>
    </table>
  ) : (
    <Placeholder type="noData" />
  );
};
