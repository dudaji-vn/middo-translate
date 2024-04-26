'use client';

import { forwardRef, useCallback } from 'react';

import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/components/message-editor';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useMessagesBox } from '@/features/chat/messages/components/message-box';
import { useSendImageMessage } from '@/features/chat/messages/hooks/use-send-image-message';
import { useSendMediaMessages } from '@/features/chat/messages/hooks/use-send-media-messages';
import { useSendTextMessage } from '@/features/chat/messages/hooks/use-send-text-message';
import { roomApi } from '@/features/chat/rooms/api';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { useChatBox } from '../../contexts/chat-box-context';
import { Message } from '@/features/chat/messages/types';
import { CreateMessage } from '@/features/chat/messages/api';

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
    const onSuccessfulSend = (data: Message, variables: CreateMessage) => {
      {
        const clientTempId = variables.clientTempId;
        if (clientTempId) {
          replaceMessage(data, clientTempId);
        }
      }
    };

    const { sendImageMessage } = useSendImageMessage({
      roomId: room._id,
      isAnonymous,
      addMessage,
      onSuccess: onSuccessfulSend,
    });

    const { sendMediaMessages } = useSendMediaMessages({
      roomId: room._id,
      isAnonymous,
      addMessage,
      onSuccess: onSuccessfulSend,
    });

    const { sendTextMessage } = useSendTextMessage({
      roomId: room._id,
      isAnonymous,
      addMessage,
      onSuccess: onSuccessfulSend,
    });

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
          sendTextMessage({
            content: trimContent,
            language: language || 'en',
            mentions: mentions || [],
            enContent,
            sender: currentUser! || guest!,
          });
        }

        if (images.length) {
          sendImageMessage({
            images,
            sender: currentUser! || guest!,
          });
        }

        if (documents.length) {
          sendMediaMessages({
            media: documents,
            sender: currentUser! || guest!,
          });
        }

        if (videos.length) {
          sendMediaMessages({ media: videos, sender: currentUser! || guest! });
        }

        const messageBox = document.getElementById('inbox-list' || '');
        setTimeout(() => {
          messageBox?.scrollTo({
            top: messageBox.scrollHeight,
          });
        }, 1000);
      },
      [
        currentUser,
        guest,
        room._id,
        room.participants,
        room.status,
        sendImageMessage,
        sendMediaMessages,
        sendTextMessage,
        updateRoom,
      ],
    );

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
