'use client';

import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/features/chat/messages/components/message-editor';
import { forwardRef, useEffect, useState } from 'react';

import { Media } from '@/types';
import { Message } from '@/features/chat/messages/types';
import { createLocalMessage } from '@/features/chat/messages/utils';
import { messageApi } from '@/features/chat/messages/api';
import { roomApi } from '@/features/chat/rooms/api';
import { useAuthStore } from '@/stores/auth.store';
import { useChatBox } from '../../contexts/chat-box-context';
import { useMessagesBox } from '@/features/chat/messages/components/message-box';
import { useMutation } from '@tanstack/react-query';
import { useMediaUpload } from '@/components/media-upload';

export interface ChatBoxFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  leftElement?: React.ReactNode;
}

export const ChatBoxFooter = forwardRef<HTMLDivElement, ChatBoxFooterProps>(
  ({ ...props }, ref) => {
    const currentUser = useAuthStore((s) => s.user);
    const { room, updateRoom } = useChatBox();
    const { addMessage } = useMessagesBox();
    const { uploadedFiles } = useMediaUpload();

    const [localImageMessageWaiting, setLocalImageMessageWaiting] =
      useState<Message | null>(null);

    const [localDocumentMessagesWaiting, setLocalDocumentMessagesWaiting] =
      useState<Message[]>([]);

    const { mutateAsync } = useMutation({
      mutationFn: messageApi.send,
    });

    const handleSendText = async (
      roomId: string,
      content: string,
      contentEnglish?: string,
      language?: string,
    ) => {
      const localMessage = createLocalMessage({
        sender: currentUser!,
        content,
        contentEnglish,
        language,
      });

      addMessage(localMessage);
      mutateAsync({
        content,
        contentEnglish,
        roomId,
        clientTempId: localMessage._id,
        language,
      });
    };

    const handleSubmit = async (data: MessageEditorSubmitData) => {
      const { content, images, documents, contentEnglish, language } = data;
      let roomId = room._id;

      if (room.status === 'temporary') {
        const res = await roomApi.createRoom({
          participants: room.participants.map((p) => p._id),
        });
        roomId = res._id;
        updateRoom(res);
      }

      const trimContent = content.trim();
      if (trimContent) {
        handleSendText(roomId, content, contentEnglish, language);
      }

      if (images.length) {
        const localImageMessage = createLocalMessage({
          sender: currentUser!,
          media: images,
        });
        addMessage(localImageMessage);
        setLocalImageMessageWaiting(localImageMessage);
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
        setLocalDocumentMessagesWaiting(localDocumentMessages);
      }
    };

    useEffect(() => {
      if (!localImageMessageWaiting || !uploadedFiles.length) return;
      const localImages = localImageMessageWaiting.media;
      if (!localImages) return;
      const imagesUploaded: Media[] = localImages.map((item) => {
        const file = uploadedFiles.find((f) => f.localUrl === item.url);
        if (file) {
          return {
            ...item,
            url: file.metadata.secure_url || file.url,
            width: file.metadata.width,
            height: file.metadata.height,
          };
        }
        return item;
      });
      mutateAsync({
        content: '',
        roomId: room._id,
        clientTempId: localImageMessageWaiting._id,
        media: imagesUploaded,
      });
      setLocalImageMessageWaiting(null);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localImageMessageWaiting, uploadedFiles, room?._id]);

    useEffect(() => {
      if (!localDocumentMessagesWaiting.length || !uploadedFiles.length) return;
      const localDocumentMessages = localDocumentMessagesWaiting;
      const documentsUploaded: Media[][] = localDocumentMessages.map(
        (message) => {
          const localDocuments = message.media;
          if (!localDocuments) return [];
          const documentsUploaded: Media[] = localDocuments.map((item) => {
            const file = uploadedFiles.find((f) => f.localUrl === item.url);
            if (file) {
              return {
                ...item,
                url: file.metadata.secure_url || file.url,
              };
            }
            return item;
          });
          return documentsUploaded;
        },
      );
      Promise.all(
        localDocumentMessages.map(async (message, index) => {
          mutateAsync({
            content: '',
            roomId: room._id,
            clientTempId: message._id,
            media: documentsUploaded[index],
          });
        }),
      );
      setLocalDocumentMessagesWaiting([]);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localDocumentMessagesWaiting, uploadedFiles, room?._id]);
    return (
      <div className="w-full border-t p-2">
        <MessageEditor scrollId="inbox-list" onSubmitValue={handleSubmit} />
      </div>
    );
  },
);
ChatBoxFooter.displayName = 'ChatBoxFooter';
