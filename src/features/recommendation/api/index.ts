import { Response } from '@/types';
import { User } from '@/features/users/types';
import { axios } from '@/lib/axios';
import queryString from 'query-string';
import { Room } from '@/features/chat/rooms/types';

const basePath = '/recommendation';
export const recommendationApi = {
  async users() {
    const path = queryString.stringifyUrl({
      url: `${basePath}/chat/users`,
    });
    const res: Response<User[]> = await axios.get(path);
    return res.data;
  },
  async rooms() {
    const path = queryString.stringifyUrl({
      url: `${basePath}/chat`,
    });
    const res: Response<Room[]> = await axios.get(path);
    return res.data;
  },
};
