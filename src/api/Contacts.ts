import { AxiosResponse } from 'axios';

import { Response } from 'models/Response';
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

export const updateContacts = async (data: Partial<Contacts>): Promise<AxiosResponse<Response>> => {
  try {
    const jwt = localStorage.getItem('jwt');
    const response: AxiosResponse<Response> = await instance.post('/contacts', data, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response;
  } catch (e) {
    return e.response;
  }
};
