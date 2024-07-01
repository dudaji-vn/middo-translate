import { axios } from '@/lib/axios';

const basePath = '/app-notifications';

export const appNotifyApi = {
  async getAll() {
    const res = await axios.get(`${basePath}`);
    return res.data;
  },
  async read(id: string) {
    const res = await axios.patch(`${basePath}/read/${id}`);
    return res.data;
  },
  async delete(id: string) {
    const res = await axios.delete(`${basePath}/${id}`);
    return res.data;
  },
};
