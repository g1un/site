import { AxiosResponse } from 'axios';
import { instance } from './Instance';

export interface Skills {
  en: string[];
  ru?: string[];
}

export const getSkills = async (): Promise<Skills> => {
  try {
    const response: AxiosResponse<{ response: [{ skills: Skills }] }> = await instance.get(
      '/skills',
    );
    return response.data.response[0].skills;
  } catch (e) {
    return e.response.data;
  }
};

export const updateSkills = async (data: Skills): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const jwt = localStorage.getItem('jwt');
    const response: AxiosResponse<{ message: string }> = await instance.post('/skills', data, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response;
  } catch (e) {
    return e;
  }
};
