import {
  CursorPagination,
  CursorParams,
  ListResponse,
  Response,
} from '@/types';

import { Message } from '@/features/chat/messages/types';
import { Room } from '../types';
import { axios } from '@/lib/axios';
import { inboxTypeMap } from '../components/inbox/inbox-main-tab';
import queryString from 'query-string';
import { uploadImage } from '@/utils/upload-img';

const basePath = '/rooms';
export const roomApi = {
  async getRooms(params: CursorParams & { type: keyof typeof inboxTypeMap }) {
    const path = queryString.stringifyUrl({
      url: basePath,
      query: params,
    });
    const res: Response<ListResponse<Room, CursorPagination>> =
      await axios.get(path);
    return res.data;
  },
  async createRoom(
    data: Pick<Room, 'name' | 'avatar'> & {
      participants: string[];
      avatarFile?: File;
    },
  ) {
    if (data.avatarFile) {
      const res = await uploadImage(data.avatarFile);
      data.avatar = res.secure_url;
    }
    const res: Response<Room> = await axios.post(basePath, data);
    return res.data;
  },
  async getMessages(roomId: string, params: CursorParams) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/${roomId}/messages`,
      query: params,
    });
    const res: Response<ListResponse<Message, CursorPagination>> =
      await axios.get(path);
    return res.data;
  },
  async deleteRoom(roomId: string) {
    const res: Response<null> = await axios.delete(`${basePath}/${roomId}`);
    return res.data;
  },

  async leaveRoom(roomId: string) {
    const res: Response<null> = await axios.delete(
      `${basePath}/${roomId}/leave`,
    );
    return res.data;
  },
};
