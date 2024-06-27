import { CursorPagination, ListResponse, Response } from '@/types';
import { Room } from '@/features/chat/rooms/types';
import { SearchParams } from '../types';
import { User } from '@/features/users/types';
import { axios } from '@/lib/axios';
import queryString from 'query-string';
import { Message } from '@/features/chat/messages/types';

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
  async createKeyword(data: {
    keyword: string;
    spaceId?: string;
    stationId?: string;
  }) {
    const res: Response<string> = await axios.post(
      `${basePath}/keywords`,
      data,
    );
    return res.data;
  },
  async deleteKeyword(keyword: string) {
    const res: Response<string> = await axios.delete(
      `${basePath}/keywords/${keyword}`,
    );
    return res.data;
  },
  async clearKeywords() {
    const res: Response<string> = await axios.delete(`${basePath}/keywords`);
    return res.data;
  },
  async getKeywords() {
    const res: Response<
      [
        {
          keyword: string;
        },
      ]
    > = await axios.get(`${basePath}/keywords`);
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
  async messages(params: SearchParams) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/messages`,
      query: params,
    });
    const res: Response<Message[]> = await axios.get(path);
    return res.data;
  },
  async conversations(
    params: SearchParams & {
      type: 'user' | 'group' | 'message';
    },
  ) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/conversations`,
      query: params,
    });
    switch (params.type) {
      case 'user':
        const res: Response<ListResponse<User, CursorPagination>> =
          await axios.get(path);
        return res.data;
      case 'group':
        const res2: Response<ListResponse<Room, CursorPagination>> =
          await axios.get(path);
        return res2.data;
      case 'message':
        const res3: Response<ListResponse<Message, CursorPagination>> =
          await axios.get(path);
        return res3.data;
    }
  },
  async messageInRoom({
    roomId,
    query,
  }: {
    roomId: string;
    query: SearchParams;
  }) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/rooms/${roomId}/messages`,
      query: query,
    });
    const res: Response<Message[]> = await axios.get(path);
    return res.data;
  },
  async count(params: SearchParams) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/inboxes/count`,
      query: params,
    });
    const res: Response<{
      totalUsers: number;
      totalGroups: number;
      totalMessages: number;
    }> = await axios.get(path);
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
