import { User } from '@/features/users/types';
import { useCallback } from 'react';
import { createLocalMessage } from '../utils';
import { SendMessageProps, useSendMessage } from './use-send-message';

export const useSendTextMessage = ({
  roomId,
  isAnonymous,
  addMessage,
  parentId,
  onSuccess,
}: SendMessageProps) => {
  const { sendMessage } = useSendMessage({ onSuccess });
  const sendTextMessage = useCallback(
    async ({
      content,
      language,
      mentions,
      enContent,
      sender,
    }: {
      content: string;
      language?: string;
      mentions?: string[];
      enContent?: string | null;
      sender: User;
    }) => {
      if (!sender) return;
      const localMessage = createLocalMessage({
        sender,
        content,
        language,
      });
      addMessage(localMessage);
      const payload = {
        isAnonymous,
        content,
        roomId,
        clientTempId: localMessage._id,
        language,
        enContent,
        mentions,
        parentId,
        ...(isAnonymous && {
          userId: sender._id,
        }),
      };

      sendMessage(payload);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAnonymous, roomId],
  );

  return { sendTextMessage };
};
