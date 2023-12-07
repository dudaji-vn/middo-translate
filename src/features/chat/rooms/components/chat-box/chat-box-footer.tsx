'use client';

import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/features/chat/messages/components/message-editor';

import { Media } from '@/types';
import { createLocalMessage } from '@/features/chat/messages/utils';
import { forwardRef } from 'react';
import { messageApi } from '@/features/chat/messages/api';
import { roomApi } from '@/features/chat/rooms/api';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth';
import { useChatBox } from '../../contexts/chat-box-context';
import { useMessagesBox } from '@/features/chat/messages/contexts';
import { useMutation } from '@tanstack/react-query';

export interface ChatBoxFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  leftElement?: React.ReactNode;
}

export const ChatBoxFooter = forwardRef<HTMLDivElement, ChatBoxFooterProps>(
  ({ ...props }, ref) => {
    const currentUser = useAuthStore((s) => s.user);
    const { room, updateRoom } = useChatBox();
    const { addMessage, replaceMessage } = useMessagesBox();

    const { mutateAsync } = useMutation({
      mutationFn: messageApi.sendMessage,
      onSuccess: (data, variables) => {
        // replaceMessage(data, variables.clientTempId);
      },
    });

    const handleSubmit = async (data: MessageEditorSubmitData) => {
      const { content, images, documents } = data;
      let roomId = room._id;

      if (room.status === 'temporary') {
        const res = await roomApi.createRoom({
          participants: room.participants.map((p) => p._id),
        });
        roomId = res._id;
        updateRoom(res);
      }

      if (content) {
        const localMessage = createLocalMessage({
          sender: currentUser!,
          content,
        });

        addMessage(localMessage);
        mutateAsync({
          content,
          roomId,
          clientTempId: localMessage._id,
        });
      }

      if (images.length) {
        const localImageMessage = createLocalMessage({
          sender: currentUser!,
          media: images,
        });
        addMessage(localImageMessage);
        const imagesUploaded: Media[] = await Promise.all(
          images.map(async (img) => {
            const res = await uploadImage(img.file!);
            return {
              url: res.secure_url,
              type: 'image',
            };
          }),
        );

        mutateAsync({
          content: '',
          roomId,
          clientTempId: localImageMessage._id,
          media: imagesUploaded,
        });
      }
      if (documents.length) {
        const localDocumentMessages = documents.map((doc) => {
          const localDocumentMessage = createLocalMessage({
            sender: currentUser!,
            media: [doc],
          });
          addMessage(localDocumentMessage);
          return localDocumentMessage;
        });
        Promise.all(
          localDocumentMessages.map(async (message, index) => {
            const res = await uploadImage(documents[index].file!);
            mutateAsync({
              content: '',
              roomId,
              clientTempId: message._id,
              media: [
                {
                  ...documents[index],
                  url: res.secure_url,
                },
              ],
            });
          }),
        );
      }
    };
    return (
      <div className="w-full border-t p-5">
        <MessageEditor onSubmitValue={handleSubmit} />
      </div>
    );
  },
);
ChatBoxFooter.displayName = 'ChatBoxFooter';
