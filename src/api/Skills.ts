import { AxiosResponse } from 'axios';
import { instance } from './Instance';

export interface Skills {
  en: string[];
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
