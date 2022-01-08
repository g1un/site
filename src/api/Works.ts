import { AxiosResponse } from 'axios';

import { instance } from './Instance';

export interface Work {
  address?: string;
  descEn: string;
  descRu: string;
  imageSrc: string;
  index: number;
  repo?: string;
  _id: string | null; // null for new Work

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

interface UpdatedWork {
  message: string;
  work?: Work;
  error?: {
    message: string;
  };
}

export const updateWorks = async (data: Partial<Work>): Promise<AxiosResponse<UpdatedWork>> => {
  try {
    const jwt = localStorage.getItem('jwt');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof Work];
      formData.append(key, value instanceof File ? value : `${value}`);
    });
    const response: AxiosResponse<UpdatedWork> = await instance.post('/works', formData, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response;
  } catch (e) {
    return e.response;
  }
};

interface WorksOrder {
  next: string;
  prev: string;
}

export const updateWorksOrder = async (
  data: WorksOrder,
): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const jwt = localStorage.getItem('jwt');
    const response: AxiosResponse<{ message: string }> = await instance.post(
      '/works',
      {
        changeIndexes: true,
        ...data,
      },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    );
    return response;
  } catch (e) {
    return e;
  }
};
