import { Media, Response } from '@/types';

import { Message, PinMessage } from '@/features/chat/messages/types';
import axios from 'axios';
import { axios as axiosWithInterceptor } from '@/lib/axios';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';

const basePath = '/messages';
const anonymousBasePath = NEXT_PUBLIC_URL + '/api';

export type CreateMessage = {
  roomId: string;
  media?: Media[];
  content: string;
  contentEnglish?: string;
  clientTempId: string;
  language?: string;
  mentions?: string[];
};
export const messageApi = {
  async send(data: CreateMessage) {
    console.log('data', data);
    const res: Response<Message> = await axiosWithInterceptor.post(
      basePath,
      data,
    );
    return res.data;
  },

  async sendAnonymousMessage(data: CreateMessage) {
    const res: Response<{ data: Message }> = await axios.post(
      anonymousBasePath + '/messages/help-desk',
      data,
    );
    return res.data?.data;
  },

  async getOne(id: string) {
    const res: Response<Message> = await axiosWithInterceptor.get(
      `${basePath}/${id}`,
    );
    return res.data;
  },

  async remove({ id, type }: { id: string; type: 'me' | 'all' }) {
    const res: Response<Message> = await axiosWithInterceptor.delete(
      `${basePath}/${id}`,
      {
        params: { type },
      },
    );
    return res.data;
  },
  async seenAnonymous(id: string) {
    // TODO: ask BE open this endpoint

    // const res: Response<Message> = await axiosWithInterceptor.patch(
    //   anonymousBasePath+ `/messages/help-desk/${id}/seen`,
    // );
    // return res.data;
    return new Promise((resolve) => resolve({}));
  },

  async seen(id: string) {
    const res: Response<Message> = await axiosWithInterceptor.patch(
      `${basePath}/${id}/seen`,
    );
    return res.data;
  },

  async react({ id, emoji }: { id: string; emoji: string }) {
    const res: Response<Message> = await axiosWithInterceptor.patch(
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
    const res: Response<Message> = await axiosWithInterceptor.post(
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
    console.log('repliedMessageId', repliedMessageId, 'message', message);
    const res: Response<Message> = await axiosWithInterceptor.post(
      `${basePath}/${repliedMessageId}/reply`,
      message,
    );
    return res.data;
  },

  async getReplies(id: string) {
    const res: Response<Message[]> = await axiosWithInterceptor.get(
      `${basePath}/${id}/replies`,
    );
    return res.data;
  },

  async pin(id: string) {
    const res: Response<Message> = await axiosWithInterceptor.post(
      `${basePath}/${id}/pin`,
    );
    return res.data;
  },
  async getPinned(id: string) {
    // TODO: ask BE for anonymous pined message or remove getting this from anonymous
    const res: Response<PinMessage[]> = await axiosWithInterceptor.get(
      `${basePath}/pinned/${id}`,
    );
    return res.data;
  },
};
