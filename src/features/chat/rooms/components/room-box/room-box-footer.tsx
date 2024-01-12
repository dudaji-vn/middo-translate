'use client';

import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/features/chat/messages/components/message-editor';
import { forwardRef, useEffect, useState } from 'react';

import { FileWithUrl } from '@/hooks/use-select-files';
import { Media } from '@/types';
import { Message } from '@/features/chat/messages/types';
import { createLocalMessage } from '@/features/chat/messages/utils';
import { messageApi } from '@/features/chat/messages/api';
import { roomApi } from '@/features/chat/rooms/api';
import { useAuthStore } from '@/stores/auth.store';
import { useChatBox } from '../../contexts/chat-box-context';

import { useMutation } from '@tanstack/react-query';
import { useMessagesBox } from '@/features/chat/messages/components/message-box';

export interface ChatBoxFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  leftElement?: React.ReactNode;
}

export const ChatBoxFooter = forwardRef<HTMLDivElement, ChatBoxFooterProps>(
  ({ ...props }, ref) => {
    const currentUser = useAuthStore((s) => s.user);
    const { room, updateRoom } = useChatBox();
    const { addMessage } = useMessagesBox();

    const [filesUploaded, setFilesUploaded] = useState<FileWithUrl[]>([]);

    const [localImageMessageWaiting, setLocalImageMessageWaiting] =
      useState<Message | null>(null);

    const [localDocumentMessagesWaiting, setLocalDocumentMessagesWaiting] =
      useState<Message[]>([]);

    const { mutateAsync } = useMutation({
      mutationFn: messageApi.sendMessage,
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

      if (content) {
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
      if (!localImageMessageWaiting || !filesUploaded.length) return;
      const localImages = localImageMessageWaiting.media;
      if (!localImages) return;
      const imagesUploaded: Media[] = localImages.map((item) => {
        const file = filesUploaded.find((f) => f.url === item.url);
        if (file) {
          return {
            ...item,
            url: file.upLoadedResponse?.secure_url || file.url,
            width: file.upLoadedResponse?.width,
            height: file.upLoadedResponse?.height,
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
    }, [localImageMessageWaiting, filesUploaded, room?._id]);

    useEffect(() => {
      if (!localDocumentMessagesWaiting.length || !filesUploaded.length) return;
      const localDocumentMessages = localDocumentMessagesWaiting;
      const documentsUploaded: Media[][] = localDocumentMessages.map(
        (message) => {
          const localDocuments = message.media;
          if (!localDocuments) return [];
          const documentsUploaded: Media[] = localDocuments.map((item) => {
            const file = filesUploaded.find((f) => f.url === item.url);
            if (file) {
              return {
                ...item,
                url: file.upLoadedResponse?.secure_url || file.url,
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
    }, [localDocumentMessagesWaiting, filesUploaded, room?._id]);

    return (
      <div className="w-full border-t p-2">
        <MessageEditor
          onSubmitValue={handleSubmit}
          onFileUploaded={setFilesUploaded}
        />
      </div>
    );
  },
);
ChatBoxFooter.displayName = 'ChatBoxFooter';
