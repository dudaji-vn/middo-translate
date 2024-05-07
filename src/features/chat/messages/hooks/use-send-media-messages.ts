import { useCallback, useEffect, useState } from 'react';
import { Message } from '../types';
import { SendMessageProps, useSendMessage } from './use-send-message';
import { useMediaUpload } from '@/components/media-upload';
import { User } from '@/features/users/types';
import { Media } from '@/types';
import { createLocalMessage } from '../utils';
// Send media with create multiple messages
export const useSendMediaMessages = ({
  roomId: _roomId,
  isAnonymous,
  addMessage,
  parentId: _parentId,
  onSuccess,
}: SendMessageProps) => {
  const { sendMessage } = useSendMessage({ onSuccess });
  const [messagesWaiting, setMessagesWaiting] = useState<Message[] | null>(
    null,
  );
  const [roomId, setRoomId] = useState<string>(_roomId); // update roomId
  const [parentId, setParentId] = useState<string | undefined>(_parentId); // update parentId
  useEffect(() => {
    setRoomId(_roomId);
    setParentId(_parentId);
  }, [_roomId, _parentId]);

  const { uploadedFiles, removeUploadedFile } = useMediaUpload();
  const sendMediaMessages = useCallback(
    async ({
      media,
      sender,
      parentId,
      roomId,
    }: {
      media: Media[];
      sender: User;
      parentId?: string;
      roomId?: string;
    }) => {
      if (roomId) {
        setRoomId(roomId);
      }
      const localMessages = media.map((doc) => {
        const message = createLocalMessage({
          sender,
          media: [doc],
        });
        addMessage(message);
        return message;
      });
      setMessagesWaiting(localMessages);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    if (!messagesWaiting || uploadedFiles.length <= 0) return;
    // get messages have mediaUploaded
    const messagesReadyToUpload = messagesWaiting.filter((message) =>
      message.media?.every((media) =>
        uploadedFiles.some((file) => file.localUrl === media.url),
      ),
    );
    if (messagesReadyToUpload.length <= 0) return;
    messagesReadyToUpload.forEach((message) => {
      sendMessage({
        clientTempId: message._id,
        content: '',
        media: message.media?.map((media) => {
          const uploadedFile = uploadedFiles.find(
            (file) => file.localUrl === media.url,
          );
          return {
            ...media,
            url: uploadedFile?.url || media.url,
          };
        }, []),
        roomId: roomId,
        isAnonymous,
        ...(isAnonymous && {
          userId: messagesWaiting?.[0].sender._id,
        }),
        parentId,
      });
    });
    setMessagesWaiting((prev) => {
      if (!prev) return prev;
      return prev.filter((message) =>
        messagesReadyToUpload.every((m) => m._id !== message._id),
      );
    });
    uploadedFiles.forEach((file) => {
      const isMatched = messagesReadyToUpload.some((message) =>
        message.media?.some((media) => media.url === file.localUrl),
      );
      if (isMatched) {
        removeUploadedFile(file);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnonymous, messagesWaiting, roomId, uploadedFiles, parentId]);

  return { sendMediaMessages };
};
