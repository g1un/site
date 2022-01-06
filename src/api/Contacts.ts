import { AxiosResponse } from 'axios';

import { instance } from './Instance';

export interface Contacts {
  email: string;
  tel: string;
  cv: {
    ru: string;
    en: string;
  };
  github: string;
}

export const getContacts = async (): Promise<Contacts> => {
  try {
    const response: AxiosResponse<{ response: Contacts }> = await instance.get('/contacts');
    return response.data.response;
  } catch (e) {
    return e.response.data;
  }
};
