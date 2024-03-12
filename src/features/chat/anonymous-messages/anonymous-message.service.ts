import {
  CursorPagination,
  CursorParams,
  ListResponse,
  Response,
} from '@/types';

import { Message } from '@/features/chat/messages/types';
import queryString from 'query-string';
import { uploadImage } from '@/utils/upload-img';
import { Room } from '../rooms/types';
import { InboxType } from '../rooms/components/inbox/inbox';
import axios from 'axios';
import { CreateMessage } from '../messages/api';

class AnounymousRoomAPI {
  private basePath: string;

  constructor(basePath: string = '/api/rooms/anonymous') {
    this.basePath = basePath;
  }

  async getMessages(
    roomId: string,
    params: CursorParams & { userId: string },
  ): Promise<ListResponse<Message, CursorPagination>> {
    const path = queryString.stringifyUrl({
      url: `${this.basePath}/${roomId}/message`,
      query: params,
    });
    const res: Response<{ data: ListResponse<Message, CursorPagination> }> =
      await axios.get(path);
    return res.data.data;
  }


  async getRoom(roomId: string, userId: string): Promise<Room> {
    const res: Response<Room> = await axios.get(
      `${this.basePath}/${roomId}?userId=${userId}`,
    );
    return res.data;
  }

  async getMedia({
    roomId,
    params,
  }: {
    roomId: string;
    params: CursorParams;
  }): Promise<ListResponse<Message, CursorPagination>> {
    const path = queryString.stringifyUrl({
      url: `${this.basePath}/${roomId}/media`,
      query: params,
    });
    const res: Response<ListResponse<Message, CursorPagination>> =
      await axios.get(path);
    return res.data;
  }

  async getFiles({
    roomId,
    params,
  }: {
    roomId: string;
    params: CursorParams;
  }): Promise<ListResponse<Message, CursorPagination>> {
    const path = queryString.stringifyUrl({
      url: `${this.basePath}/${roomId}/files`,
      query: params,
    });
    const res: Response<ListResponse<Message, CursorPagination>> =
      await axios.get(path);
    return res.data;
  }
}
const anounymousRoomAPI = new AnounymousRoomAPI();

export { anounymousRoomAPI, AnounymousRoomAPI };
