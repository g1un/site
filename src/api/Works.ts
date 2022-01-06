import { AxiosResponse } from 'axios';

import { instance } from './Instance';

export interface Work {
  address?: string;
  descEn: string;
  descRu: string;
  imageSrc: string;
  index: number;
  repo?: string;
  _id: string;
}

export const getWorks = async (): Promise<Work[]> => {
  try {
    const response: AxiosResponse<Work[]> = await instance.get('/works');
    return response.data;
  } catch (e) {
    return e.response.data;
  }
};
