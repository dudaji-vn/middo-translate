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
  async toggleRoomNotification(roomId: string) {
    const res = await axios.post(`${basePath}/room/toggle`, { roomId });
    return res.data;
  },

  async checkIsRoomMuted(roomId: string) {
    const res = await axios.post(`${basePath}/room/${roomId}/check`);
    return res.data;
  },
};
