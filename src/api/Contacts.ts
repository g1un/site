import { AxiosResponse } from 'axios';

import { GetResponse, UpdateResponse } from 'models/Response';
import { instance } from './Instance';

export interface Contacts {
  email: string;
  tel: string;
  cv: string;
  github: string;
}

export const getContacts = async (): Promise<Contacts> => {
  try {
    const response: AxiosResponse<GetResponse<Contacts>> = await instance.get('/contacts');
    return response.data.data;
  } catch (e) {
    return e.response.data.error;
  }
};

export const updateContacts = async (
  data: Partial<Contacts>,
): Promise<AxiosResponse<UpdateResponse<Contacts>>> => {
  try {
    const jwt = localStorage.getItem('jwt');
    const response: AxiosResponse<UpdateResponse<Contacts>> = await instance.post(
      '/contacts',
      data,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    );
    return response;
  } catch (e) {
    return e.response;
  }
};
