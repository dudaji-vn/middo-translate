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
export const patch = (url: string, body: any) => {
    return axios.patch(url, body);
}
export const remove = (url: string, body: any) => {
    return axios.delete(url, { data: body });
}

