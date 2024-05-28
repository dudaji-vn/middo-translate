import {
  CursorPagination,
  CursorParams,
  ListResponse,
  Response,
} from '@/types';

import { Message } from '@/features/chat/messages/types';
import { Room, RoomStatus } from '../types';
import { axios } from '@/lib/axios';
import queryString from 'query-string';
import { uploadImage } from '@/utils/upload-img';
import { InboxType } from '../components/inbox/inbox';
import { t } from 'i18next';
import { convertRoomsFilterOptionsToString } from '@/utils/get-rooms-filter-options';
import { SpaceInboxFilterState } from '@/stores/space-inbox-filter.store';

const basePath = '/rooms';

export const roomApi = {
  async getRoom(roomId: string) {
    const res: Response<Room> = await axios.get(`${basePath}/${roomId}`);
    return res.data;
  },
  async getRooms(
    params: CursorParams & {
      type: InboxType;
      status?: string | null;
      spaceId?: string;
      filterOptions?: {
        domains?: string[];
        countries?: string[];
        tags?: string[];
      };
    },
  ) {
    const { filterOptions, ...restParams } = params;
    const queryParams = {
      ...restParams,
      ...convertRoomsFilterOptionsToString(filterOptions),
    };
    const path = queryString.stringifyUrl({
      url: basePath,
      query: queryParams,
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

  async updateRoom({ roomId, data }: { roomId: string; data: Partial<Room> }) {
    const res: Response<Room> = await axios.patch(
      `${basePath}/${roomId}`,
      data,
    );
    return res.data;
  },
  async changeRoomStatus({
    roomId,
    status,
  }: {
    roomId: string;
    status: RoomStatus;
  }) {
    const res: Response<Room> = await axios.patch(
      `${basePath}/${roomId}/change-status-room`,
      { status },
    );
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

  async getMedia({ roomId, params }: { roomId: string; params: CursorParams }) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/${roomId}/media`,
      query: params,
    });
    const res: Response<ListResponse<Message, CursorPagination>> =
      await axios.get(path);
    return res.data;
  },
  async getFiles({ roomId, params }: { roomId: string; params: CursorParams }) {
    const path = queryString.stringifyUrl({
      url: `${basePath}/${roomId}/files`,
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
  async addMembers({ roomId, userIds }: { roomId: string; userIds: string[] }) {
    const res: Response<Room> = await axios.post(
      `${basePath}/${roomId}/members`,
      {
        participants: userIds,
      },
    );
    return res.data;
  },
  async removeMember({
    roomId,
    userId,
  }: {
    roomId: string;
    userId: string;
  }): Promise<Room> {
    const res: Response<Room> = await axios.delete(
      `${basePath}/${roomId}/members`,
      {
        data: {
          userId,
        },
      },
    );
    return res.data;
  },
  async deleteAllMessages(roomId: string) {
    const res: Response<Room> = await axios.delete(
      `${basePath}/${roomId}/messages`,
    );
    return res.data;
  },

  async getCloudCount(roomId: string) {
    const res: Response<{
      count: number;
      mediaCount: number;
      fileCount: number;
      linkCount: number;
    }> = await axios.get(`${basePath}/${roomId}/cloud/count`);
    return res.data;
  },
  async getFileCount(roomId: string) {
    const res: Response<{ count: number }> = await axios.get(
      `${basePath}/${roomId}/cloud/file/count`,
    );
    return res.data;
  },
  async getMediaCount(roomId: string) {
    const res: Response<{ count: number }> = await axios.get(
      `${basePath}/${roomId}/cloud/media/count`,
    );
    return res.data;
  },

  async pin(roomId: string) {
    const res: Response<Room> = await axios.post(`${basePath}/${roomId}/pin`);
    return res.data;
  },

  async getPinned(spaceId?: string) {
    const res: Response<Room[]> = await axios.get(
      `${basePath}/pin` + (spaceId ? `?spaceId=${spaceId}` : ''),
    );
    return res.data;
  },

  async toggleArchive({
    roomId,
    archive,
  }: {
    roomId: string;
    archive: boolean;
  }) {
    const res: Response<Room> = await axios.patch(
      `${basePath}/${roomId}/${archive ? 'archive' : 'unarchive'}`,
    );
    return res.data;
  },

  async changeTagRoom({
    roomId,
    tagId,
  }: {
    roomId: string;
    tagId?: string | null;
  }) {
    const res: Response<Room> = await axios.patch(
      `${basePath}/${roomId}/change-tag-room`,
      { tagId },
    );
    return res.data;
  },

  async accept(roomId: string) {
    const res: Response<Room> = await axios.patch(
      `${basePath}/${roomId}/accept`,
    );
    return res.data;
  },
  async reject(roomId: string) {
    const res: Response<Room> = await axios.patch(
      `${basePath}/${roomId}/reject`,
    );
    return res.data;
  },
};
