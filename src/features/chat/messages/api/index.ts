import { Media, Response } from '@/types';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { Message, PinMessage } from '@/features/chat/messages/types';
import { axios as axiosWithInterceptor } from '@/lib/axios';

const basePath = '/messages';
const anonymousBasePath = NEXT_PUBLIC_URL + '/api';
type senderType = 'bot' | 'user' | 'anonymous';
export type CreateMessage = {
  roomId: string;
  media?: Media[];
  content: string;
  clientTempId: string;
  language?: string;
  mentions?: string[];
  enContent?: string | null;
  isAnonymous?: boolean;
  senderType?: senderType;
  parentId?: string;
};
export const messageApi = {
  async send(data: CreateMessage) {
    if (data.isAnonymous) {
      return messageApi.sendAnonymousMessage(data);
    }
    if (data.parentId) {
      return messageApi.reply({
        repliedMessageId: data.parentId,
        message: data,
      });
    }
    const res: Response<Message> = await axiosWithInterceptor.post(
      basePath,
      data,
    );
    return res.data;
  },

  async sendAnonymousMessage(data: CreateMessage) {
    const res: Response<Message> = await axiosWithInterceptor.post(
      anonymousBasePath + '/messages/help-desk',
      data,
    );
    return res.data;
  },

  async getOne(id: string) {
    const res: Response<Message> = await axiosWithInterceptor.get(
      `${basePath}/${id}`,
    );
    return res.data;
  },

  async getOneAnonymous(id: string, userId: string) {
    const res: Response<Message> = await axiosWithInterceptor.get(
      `${basePath}/${id}/anonymous/${userId}`,
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
  async seenAnonymous(id: String, anonymousId: string) {
    const res = await fetch(
      anonymousBasePath + `/messages/help-desk/${id}/seen`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: anonymousId }),
      },
    );
    return res.json();
  },

  async seen(id: string) {
    const res: Response<Message> = await axiosWithInterceptor.patch(
      `${basePath}/${id}/seen`,
    );
    return res.data;
  },

  async checkSeen(id: string) {
    try {
      const res: Response<{
        seen: boolean;
      }> = await axiosWithInterceptor.get(`${basePath}/${id}/seen`);

      return res.data;
    } catch (error) {
      return { seen: false };
    }
  },

  async checkSeenAnonymous(id: string, guestId: string) {
    try {
      const res = await fetch(
        `${anonymousBasePath}/messages/help-desk/${id}/seen/${guestId}`,
      );
      return res.json();
    } catch (error) {
      return { seen: false };
    }
  },
  async edit({
    id,
    data,
  }: {
    id: string;
    data: Pick<
      CreateMessage,
      'content' | 'enContent' | 'mentions' | 'language'
    >;
  }) {
    console.log(`${basePath}/${id}/edit`);
    const res: Response<Message> = await axiosWithInterceptor.patch(
      `${basePath}/${id}/edit`,
      data,
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

  async getRepliesAnonymous(id: string, userId: string) {
    const res: Response<Message[]> = await axiosWithInterceptor.get(
      `${basePath}/${id}/replies/anonymous/${userId}`,
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
  async translate({ id, to }: { id: string; to: string }) {
    const res: Response<Message> = await axiosWithInterceptor.patch(
      `${basePath}/${id}/translate`,
      {
        to,
      },
    );
    return res.data;
  },
  async markAsReadAllChild(id: string) {
    const res: Response<Message> = await axiosWithInterceptor.patch(
      `${basePath}/${id}/reply/mark-all-as-read`,
    );
    return res.data;
  },

  async countUnreadChild(id: string) {
    const res: Response<{ count: number }> = await axiosWithInterceptor.get(
      `${basePath}/${id}/reply/unread-count`,
    );
    return res.data;
  },
};
