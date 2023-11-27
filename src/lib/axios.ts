import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import axios from 'axios';

const instance = axios.create({
  baseURL: NEXT_PUBLIC_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response.status === 401) {
      console.log('🚀 ~ file: axios-config.ts:29 ~ Unauthorized');
    } else {
      console.log(
        '🚀 ~ file: axios-config.ts:31 ~ error',
        error.response.message,
      );
    }
    return Promise.reject(error);
  },
);

export { instance as axios };
