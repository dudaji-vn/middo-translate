'use client';

import { forwardRef, useCallback, useMemo, useState } from 'react';

import BlockChatBar from '@/components/block-chat-bar';
import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/features/chat/messages/components/message-editor/message-editor';
import { SOCKET_CONFIG } from '@/configs/socket';
import { CreateMessage } from '@/features/chat/messages/api';
import { useMessageActions } from '@/features/chat/messages/components/message-actions';
import { useMessagesBox } from '@/features/chat/messages/components/message-box';
import { useSendImageMessage } from '@/features/chat/messages/hooks/use-send-image-message';
import { useSendMediaMessages } from '@/features/chat/messages/hooks/use-send-media-messages';
import { useSendTextMessage } from '@/features/chat/messages/hooks/use-send-text-message';
import { Message } from '@/features/chat/messages/types';
import { roomApi } from '@/features/chat/rooms/api';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslation } from 'react-i18next';
import { useChatBox } from '../../contexts/chat-box-context';
import { RoomBlockContent } from './room-block-content';
import { useCheckRoomRelationship } from '@/features/users/hooks/use-relationship';
import { RoomWaitingContent } from './room-waiting-content';
import { RoomResponseContent } from './room-response-content';
import { RoomActions } from '../room-actions';

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
    const { t } = useTranslation('common');
    const currentUser = useAuthStore((s) => s.user);
    const { room, updateRoom } = useChatBox();
    const { relationshipStatus } = useCheckRoomRelationship(room);
    const [roomId, setRoomId] = useState<string>(room._id);
    const { addMessage, replaceMessage, updateMessage } = useMessagesBox();
    const onSuccessfulSend = (data: Message, variables: CreateMessage) => {
      {
        const clientTempId = variables.clientTempId;
        if (clientTempId) {
          replaceMessage(data, clientTempId);
        }
      }
    };

    const { sendImageMessage } = useSendImageMessage({
      roomId,
      isAnonymous,
      addMessage,
      onSuccess: onSuccessfulSend,
    });

    const { sendMediaMessages } = useSendMediaMessages({
      roomId,
      isAnonymous,
      addMessage,
      onSuccess: onSuccessfulSend,
    });

    const { sendTextMessage } = useSendTextMessage({
      roomId,
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
            stationId: room.station as string,
          });
          setRoomId(roomId);
          roomId = res._id;
          updateRoom(res);
        }

        const trimContent = content.trim();

        if (trimContent) {
          sendTextMessage({
            content: trimContent,
            language: language,
            mentions: mentions || [],
            enContent,
            sender: currentUser! || guest!,
            roomId,
          });
        }

        if (images.length) {
          sendImageMessage({
            images,
            sender: currentUser! || guest!,
            roomId,
          });
        }

        if (documents.length) {
          sendMediaMessages({
            media: documents,
            sender: currentUser! || guest!,
            roomId,
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
        room.station,
        room.status,
        sendImageMessage,
        sendMediaMessages,
        sendTextMessage,
        updateRoom,
      ],
    );

    const { action, message } = useMessageActions();
    const isEdit = useMemo(() => {
      if (action !== 'edit') return false;
      if (room._id !== message?.room?._id) return false;
      return true;
    }, [action, room._id, message?.room?._id]);

    const isBlockedConversation = useMemo(() => {
      const isConversationExpired = new Date(room.expiredAt || '') < new Date();
      const isConversationEndedByVisitor =
        room.lastMessage?.type === 'action' &&
        room.lastMessage.action === 'leaveHelpDesk';
      let isOtherUserDeleted = false;
      if (!room.isGroup && !room.isHelpDesk) {
        isOtherUserDeleted = room.participants.some(
          (p) => p._id !== currentUser?._id && p.status === 'deleted',
        );
      }
      return (
        isConversationExpired ||
        isConversationEndedByVisitor ||
        isOtherUserDeleted ||
        room.status === 'cannot_message'
      );
    }, [
      room.expiredAt,
      room.lastMessage?.type,
      room.lastMessage?.action,
      room.isGroup,
      room.isHelpDesk,
      room.status,
      room.participants,
      currentUser?._id,
    ]);
    const isAdmin = room.admin._id === currentUser?._id;
    const isShowEditor = useMemo(() => {
      if (relationshipStatus === 'blocking' || isBlockedConversation)
        return false;
      if (room.status === 'waiting' && room.isGroup) return false;
      return true;
    }, [isBlockedConversation, relationshipStatus, room.isGroup, room.status]);

    if (isBlockedConversation || relationshipStatus === 'blocked') {
      return (
        <div className="relative w-full border-t bg-primary-100 p-2 dark:bg-background">
          <BlockChatBar
            blockContent={t('CONVERSATION.BLOCKED.MESSAGE')}
            learnMoreLink={'/?guide=why-i-can-not-reply-to-a-conversation'}
            learnMoreText={t('CONVERSATION.BLOCKED.LEARN_MORE')}
          />
        </div>
      );
    }
    return (
      <div className={'relative w-full border-t p-2'}>
        {relationshipStatus === 'blocking' && <RoomBlockContent room={room} />}
        {room.status === 'waiting_group' &&
          relationshipStatus !== 'blocking' && (
            <>
              {isAdmin ? (
                <RoomWaitingContent room={room} />
              ) : (
                <RoomActions>
                  <RoomResponseContent room={room} />
                </RoomActions>
              )}
            </>
          )}
        {room.status === 'waiting' && <RoomWaitingContent room={room} />}

        {isShowEditor && (
          <MessageEditor
            isMediaDisabled={
              room.status === 'waiting' || room.status === 'waiting_group'
            }
            isEditing={isEdit}
            onEditSubmit={updateMessage}
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
        )}
      </div>
    );
  },
);
ChatBoxFooter.displayName = 'ChatBoxFooter';
