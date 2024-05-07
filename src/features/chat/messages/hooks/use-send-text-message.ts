import { User } from '@/features/users/types';
import { useCallback, useEffect, useState } from 'react';
import { createLocalMessage } from '../utils';
import { SendMessageProps, useSendMessage } from './use-send-message';

export const useSendTextMessage = ({
  roomId: _roomId,
  isAnonymous,
  addMessage,
  parentId: _parentId,
  onSuccess,
}: SendMessageProps) => {
  const { sendMessage } = useSendMessage({ onSuccess });
  const [roomId, setRoomId] = useState<string>(_roomId);
  const [parentId, setParentId] = useState<string | undefined>(_parentId);
  useEffect(() => {
    setRoomId(_roomId);
    setParentId(_parentId);
  }, [_roomId, _parentId]);
  const sendTextMessage = useCallback(
    async ({
      content,
      language,
      mentions,
      enContent,
      sender,
      roomId: _roomIdParam,
    }: {
      content: string;
      language?: string;
      mentions?: string[];
      enContent?: string | null;
      sender: User;
      roomId?: string;
    }) => {
      if (!sender) return;
      const localMessage = createLocalMessage({
        sender,
        content,
        language,
      });
      if (_roomIdParam) {
        setRoomId(_roomIdParam);
      }
      addMessage(localMessage);
      const payload = {
        isAnonymous,
        content,
        roomId: _roomIdParam || roomId,
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
    [isAnonymous, parentId, roomId],
  );

  return { sendTextMessage };
};
