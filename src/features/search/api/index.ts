import { Response } from '@/types';
import { Room } from '@/features/chat/rooms/types';
import { SearchParams } from '../types';
import { User } from '@/features/users/types';
import { axios } from '@/lib/axios';
import queryString from 'query-string';

const basePath = '/search';
export const searchApi = {
  async inboxes(params: SearchParams) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/inboxes`,
      query: params,
    });
    const res: Response<{
      rooms: Room[];
      users: User[];
    }> = await axios.get(path);
    return res.data;
  },  
  async businessInboxes(params: SearchParams) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/inboxes`,
      query: params,
    });
    const res: Response<{
      rooms: Room[];
      users: User[];
    }> = await axios.get(path);
    return res.data;
  },
  async users(params: SearchParams) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/users`,
      query: params,
    });
    const res: Response<User[]> = await axios.get(path);
    return res.data;
  },
};
