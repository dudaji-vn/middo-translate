import { Media, Response } from '@/types';

import { Message } from '@/features/chat/messages/types';
import { axios } from '@/lib/axios';

const basePath = '/messages';
export type CreateMessage = {
  roomId: string;
  media?: Media[];
  content: string;
  contentEnglish?: string;
  clientTempId: string;
  language?: string;
};
export const messageApi = {
  async send(data: CreateMessage) {
    const res: Response<Message> = await axios.post(basePath, data);
    return res.data;
  },

  async getOne(id: string) {
    const res: Response<Message> = await axios.get(`${basePath}/${id}`);
    return res.data;
  },

  async remove({ id, type }: { id: string; type: 'me' | 'all' }) {
    const res: Response<Message> = await axios.delete(`${basePath}/${id}`, {
      params: { type },
    });
    return res.data;
  },
  async seen(id: string) {
    const res: Response<Message> = await axios.patch(`${basePath}/${id}/seen`);
    return res.data;
  },

  async react({ id, emoji }: { id: string; emoji: string }) {
    const res: Response<Message> = await axios.patch(
      `${basePath}/${id}/react`,
      {
        emoji,
      },
    );
    return res.data;
  },

  async forward(data: {
    roomIds: string[];
    forwardedMessageId: string;
    message: Omit<CreateMessage, 'roomId' | 'clientTempId'>;
  }) {
    const { forwardedMessageId, ...sendData } = data;
    const res: Response<Message> = await axios.post(
      `${basePath}/${data.forwardedMessageId}/forward`,
      sendData,
    );
    return res.data;
  },

  async reply(data: {
    repliedMessageId: string;
    message: Omit<CreateMessage, 'clientTempId'>;
  }) {
    const { repliedMessageId, message } = data;
    const res: Response<Message> = await axios.post(
      `${basePath}/${repliedMessageId}/reply`,
      message,
    );
    return res.data;
  },

  async getReplies(id: string) {
    const res: Response<Message[]> = await axios.get(
      `${basePath}/${id}/replies`,
    );
    return res.data;
  },
};
