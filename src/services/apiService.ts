import { axios } from '@/lib/axios'

export const get = (url: string) => {
    return axios.get(url);
};

export const post = (url: string, body: any) => {
    return axios.post(url, body);
};

export const put = (url: string, body: any) => {
    return axios.put(url, body);
};
