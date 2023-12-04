import { axios } from '@/lib/axios'
export const get = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const post = async (url: string, body: any) => {
    try {
        const response = await axios.post(url, body);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const put = async (url: string, body: any) => {
    try {
        const response = await axios.put(url, body);
        return response.data;
    } catch (error) {
        throw error;
    }
};
