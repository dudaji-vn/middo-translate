'use client';

import { forwardRef, useCallback, useEffect, useState } from 'react';

import { useMediaUpload } from '@/components/media-upload';
import { SOCKET_CONFIG } from '@/configs/socket';
import { messageApi } from '@/features/chat/messages/api';
import { useMessagesBox } from '@/features/chat/messages/components/message-box';
import { Message } from '@/features/chat/messages/types';
import { createLocalMessage } from '@/features/chat/messages/utils';
import { roomApi } from '@/features/chat/rooms/api';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { Media } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useChatBox } from '../../contexts/chat-box-context';
import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/components/message-editor';

export interface ChatBoxFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  leftElement?: React.ReactNode;
  isAnonymous?: boolean;
  guest?: {
    _id: string;
    name: string;
  };
}

export const ChatBoxFooter = forwardRef<HTMLDivElement, ChatBoxFooterProps>(
  ({ isAnonymous, guest, ...props }, ref) => {
    const currentUser = useAuthStore((s) => s.user);
    const { room, updateRoom } = useChatBox();
    const { addMessage, replaceMessage } = useMessagesBox();
    const { uploadedFiles } = useMediaUpload();

    const [localImageMessageWaiting, setLocalImageMessageWaiting] =
      useState<Message | null>(null);

    const [localDocumentMessagesWaiting, setLocalDocumentMessagesWaiting] =
      useState<Message[]>([]);

    const [localVideoMessageWaiting, setLocalVideoMessageWaiting] = useState<
      Message[]
    >([]);

    const { mutateAsync } = useMutation({
      mutationFn: isAnonymous
        ? messageApi.sendAnonymousMessage
        : messageApi.send,
      onSuccess(data, variables) {
        const clientTempId = variables.clientTempId;
        if (clientTempId) {
          replaceMessage(data, clientTempId);
        }
      },
    });

    const handleSendText = useCallback(
      async ({
        roomId,
        content,
        language,
        mentions,
        enContent,
      }: {
        roomId: string;
        content: string;
        language: string;
        mentions: string[];
        enContent?: string | null;
      }) => {
        if (!currentUser && !guest) return;
        const localMessage = createLocalMessage({
          sender: currentUser! || guest!,
          content,
          language,
        });
        addMessage(localMessage);
        const payload = {
          content,
          roomId,
          clientTempId: localMessage._id,
          language,
          enContent,
          mentions,
          ...(isAnonymous && {
            userId: currentUser?._id || guest?._id,
          }),
        };
        mutateAsync(payload);
      },
      [addMessage, currentUser, guest, isAnonymous, mutateAsync],
    );

    const handleSubmit = useCallback(
      async (data: MessageEditorSubmitData) => {
        const {
          content,
          images,
          documents,
          language,
          mentions,
          videos,
          enContent,
        } = data;
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
          handleSendText({
            roomId,
            content: trimContent,
            language: language || 'en',
            mentions: mentions || [],
            enContent,
          });
        }

        if (images.length) {
          const localImageMessage = createLocalMessage({
            sender: currentUser! || guest!,
            media: images,
          });
          addMessage(localImageMessage);
          setLocalImageMessageWaiting(localImageMessage);
        }

        if (documents.length) {
          const localDocumentMessages = documents.map((doc) => {
            const localDocumentMessage = createLocalMessage({
              sender: currentUser! || guest!,
              media: [doc],
            });
            addMessage(localDocumentMessage);
            return localDocumentMessage;
          });
          setLocalDocumentMessagesWaiting(localDocumentMessages);
        }

        if (videos.length) {
          const localVideoMessages = videos.map((video) => {
            const localVideoMessage = createLocalMessage({
              sender: currentUser! || guest!,
              media: [video],
            });
            addMessage(localVideoMessage);
            return localVideoMessage;
          });
          setLocalVideoMessageWaiting(localVideoMessages);
        }

        const messageBox = document.getElementById('inbox-list' || '');
        setTimeout(() => {
          messageBox?.scrollTo({
            top: messageBox.scrollHeight,
          });
        }, 1);
      },
      [
        addMessage,
        currentUser,
        guest,
        handleSendText,
        room._id,
        room.participants,
        room.status,
        updateRoom,
      ],
    );

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
        // only help-desk extension  need `userId` field
        ...(isAnonymous && { userId: currentUser?._id || guest?._id }),
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
            ...(isAnonymous && { userId: currentUser?._id || guest?._id }),
          });
        }),
      );
      setLocalDocumentMessagesWaiting([]);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localDocumentMessagesWaiting, uploadedFiles, room?._id]);
    useEffect(() => {
      if (!localVideoMessageWaiting.length || !uploadedFiles.length) return;
      const localVideoMessages = localVideoMessageWaiting;
      const videosUploaded: Media[][] = localVideoMessages.map((message) => {
        const localVideos = message.media;

        if (!localVideos) return [];
        const VideosUploaded: Media[] = localVideos.map((item) => {
          const file = uploadedFiles.find((f) => f.localUrl === item.url);
          if (file) {
            return {
              ...item,
              url: file.metadata.secure_url || file.url,
            };
          }
          return item;
        });
        return VideosUploaded;
      });
      Promise.all(
        localVideoMessages.map(async (message, index) => {
          mutateAsync({
            content: '',
            roomId: room._id,
            clientTempId: message._id,
            media: videosUploaded[index],
            ...(isAnonymous && { userId: currentUser?._id || guest?._id }),
          });
        }),
      );
      setLocalVideoMessageWaiting([]);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localVideoMessageWaiting, uploadedFiles, room?._id]);
    return (
      <div className="relative w-full border-t p-2">
        <MessageEditor
          roomId={room._id}
          userMentions={room.isGroup ? room.participants : []}
          onSubmitValue={handleSubmit}
          onTypingChange={(isTyping) => {
            socket.emit(SOCKET_CONFIG.EVENTS.TYPING.UPDATE.SERVER, {
              roomId: room._id,
              isTyping,
            });
          }}
        />
      </div>
    );
  },
);
ChatBoxFooter.displayName = 'ChatBoxFooter';
