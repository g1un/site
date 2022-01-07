import { AxiosResponse } from 'axios';

import { instance } from './Instance';

interface Authorize {
  email: string;
  password: string;
}

interface AuthorizeResponse {
  message: string;
  token: string;
}

export const authorize = async (data: Authorize): Promise<AuthorizeResponse> => {
  try {
    const response: AxiosResponse<AuthorizeResponse> = await instance.post('/user/login', data);
    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

export const checkAuth = async (jwt: string): Promise<number> => {
  try {
    const response: AxiosResponse<{ message: string }> = await instance.get('/admin', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.status;
  } catch (e) {
    return e.response.status;
  }
};
