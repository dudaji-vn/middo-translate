import { axios } from '@/lib/axios';

const basePath = '/notifications';

export const notificationApi = {
  async subscribe(token: string) {
    const res = await axios.post(`${basePath}/subscribe`, { token });
    return res.data;
  },
  async checkSubscription(token: string) {
    const res = await axios.post(`${basePath}/check`, { token });
    return res.data;
  },
};
