import { Media, Response } from '@/types';

import { Message } from '@/features/chat/messages/types';
import { axios } from '@/lib/axios';

type CreateMessageData = {
  roomId: string;
  media?: Media[];
  content: string;
  localId: string;
};

const basePath = '/messages';
export const messageApi = {
  async sendMessage(data: {
    roomId: string;
    media?: Media[];
    content: string;
    contentEnglish?: string;
    clientTempId: string;
    language?: string;
  }) {
    const res: Response<Message> = await axios.post(basePath, data);
    return res.data;
  },

  async remove({ id, type }: { id: string; type: 'me' | 'all' }) {
    const res: Response<Message> = await axios.delete(`${basePath}/${id}`, {
      params: { type },
    });
    return res.data;
  },
  async seenMessage(id: string) {
    const res: Response<Message> = await axios.patch(`${basePath}/${id}/seen`);
    return res.data;
  },
};
