import axios from 'axios';

const IS_PROD = process.env.NODE_ENV === 'production';

export const instance = axios.create({
  baseURL: `${IS_PROD ? window.location.origin : 'http://localhost:3000'}/api`,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.response.use(
  (response) => response,
  (response) => {
    if (response.response.status === 401) {
      localStorage.removeItem('jwt');
      window.location.reload();
    }
    return Promise.reject(response);
  },
);
