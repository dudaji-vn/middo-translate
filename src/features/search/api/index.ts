import { Response } from '@/types';
import { Room } from '@/features/chat/rooms/types';
import { SearchParams } from '../types';
import { User } from '@/features/users/types';
import { axios } from '@/lib/axios';
import queryString from 'query-string';

type HelpdeskSearchParam = {
  type?: string;
  spaceId?: string;
};
type StationParams = {
  stationId?: string;
};
const basePath = '/search';
export const searchApi = {
  async inboxes(params: SearchParams & HelpdeskSearchParam & StationParams) {
    console.log('searchApi.inboxes', params);
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
  async users(params: SearchParams & StationParams) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/users`,
      query: params,
    });
    const res: Response<User[]> = await axios.get(path);
    return res.data;
  },
  async username(params: SearchParams & StationParams) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/users/username`,
      query: params,
    });
    const res: Response<User[]> = await axios.get(path);
    return res.data;
  },
};
