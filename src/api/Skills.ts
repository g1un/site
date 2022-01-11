import { AxiosResponse } from 'axios';
import { GetResponse, UpdateResponse } from 'models/Response';
import { instance } from './Instance';

export interface Skills {
  de?: string;
  en?: string;
}

export const getSkills = async (): Promise<Skills> => {
  try {
    const response: AxiosResponse<GetResponse<Skills>> = await instance.get('/skills');
    return response.data.data;
  } catch (e) {
    return e.response.data.error;
  }
};

export const updateSkills = async (
  data: Skills,
): Promise<AxiosResponse<UpdateResponse<Skills>>> => {
  try {
    const jwt = localStorage.getItem('jwt');
    const response: AxiosResponse<UpdateResponse<Skills>> = await instance.post('/skills', data, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response;
  } catch (e) {
    return e;
  }
};
