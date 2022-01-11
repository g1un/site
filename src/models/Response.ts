export interface Response {
  message: string;
  error?: {
    message: string;
  };
}

export interface GetResponse<T> {
  data: T;
}

export interface UpdateResponse<T> {
  message: string;
  data?: T;
  error?: {
    message: string;
  };
}
