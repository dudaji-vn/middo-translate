import { toast } from '@/components/toast';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import axios from 'axios';

const instance = axios.create({
  baseURL: NEXT_PUBLIC_URL + '/api',
});

// Add a request interceptor
instance.interceptors.request.use(
  function (request) {
    const token = localStorage.getItem("access_token");
    if (token) {
      request.headers.Authorization = "Bearer " + token;
    }
    return request;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if(response.data.message) toast({ title: 'Success',description: response.data.message })
    return response.data;
  },
  function (error) {
    
    if(error.response.data)
      toast({ title: 'Error',description: error.response.data.message || error.response.data.error })
    
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
