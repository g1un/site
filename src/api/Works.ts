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

  // for sending image
  imageFile?: File;
}

export const getWorks = async (): Promise<Work[]> => {
  try {
    const response: AxiosResponse<Work[]> = await instance.get('/works');
    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

export const updateWorks = async (data: Partial<Work>): Promise<AxiosResponse<{ message: string; work: Work }>> => {
  try {
    const jwt = localStorage.getItem('jwt');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof Work];
      formData.append(key, value instanceof File ? value : `${value}`);
    });
    const response: AxiosResponse<{ message: string; work: Work }> = await instance.post(
      '/works',
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      },
  );
    return response;
  } catch (e) {
    return e;
  }
};
