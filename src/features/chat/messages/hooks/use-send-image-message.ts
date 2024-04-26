import { User } from '@/features/users/types';
import { Media } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { createLocalMessage } from '../utils';
import { SendMessageProps, useSendMessage } from './use-send-message';
import { useMediaUpload } from '@/components/media-upload';
import { Message } from '../types';

export const useSendImageMessage = ({
  roomId,
  isAnonymous,
  addMessage,
  parentId,
  onSuccess,
}: SendMessageProps) => {
  const { sendMessage } = useSendMessage({ onSuccess });
  const [messageWaiting, setMessageWaiting] = useState<Message | null>(null);

  const { uploadedFiles, removeUploadedFile } = useMediaUpload();
  const sendImageMessage = useCallback(
    async ({ images, sender }: { images: Media[]; sender: User }) => {
      const localImageMessage = createLocalMessage({
        sender,
        media: images,
      });
      addMessage(localImageMessage);
      setMessageWaiting(localImageMessage);
    },
    [addMessage],
  );
  useEffect(() => {
    if (!messageWaiting || uploadedFiles.length <= 0) return;
    const filesWaiting = messageWaiting.media!;
    const matchedUploadedFiles: Media[] = [];
    filesWaiting.forEach((file) => {
      const uploadedFile = uploadedFiles.find((f) => f.localUrl === file.url);
      if (uploadedFile) {
        matchedUploadedFiles.push({
          ...file,
          url: uploadedFile.url,
        });
      }
    });
    if (matchedUploadedFiles.length !== filesWaiting.length) return;
    sendMessage({
      clientTempId: messageWaiting._id,
      content: '',
      media: matchedUploadedFiles,
      roomId: roomId,
      isAnonymous,
      parentId,
    });
    setMessageWaiting(null);
    uploadedFiles.forEach((file) => {
      const isMatched = matchedUploadedFiles.find((f) => f.url === file.url);
      if (isMatched) {
        removeUploadedFile(file);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageWaiting, roomId, uploadedFiles]);

  return { sendImageMessage };
};
