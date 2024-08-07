import { ROUTE_NAMES } from '@/configs/route-name';
import { SOCKET_CONFIG } from '@/configs/socket';
import { Room } from '@/features/chat/rooms/types';
import socket from '@/lib/socket-io';
import { useQueryClient } from '@tanstack/react-query';
import { convert } from 'html-to-text';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Message } from '../../types';
import { USE_COUNT_UNREAD_CHILD_KEY } from '../../hooks/use-count-unread-child';

export const useMessageSocket = ({
  room,
  userId,
  guestId,
  replaceItem,
  updateItem,
  setNotification,
  updateRecentFormStatus = (_id: string) => {},
}: {
  replaceItem: (message: Message, clientTempId: string) => void;
  room: Room;
  updateItem: (message: Message) => void;
  userId: string;
  guestId: string;
  setNotification: (message: string) => void;
  updateRecentFormStatus?: (_id: string) => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on(
      SOCKET_CONFIG.EVENTS.MESSAGE.NEW,
      ({
        clientTempId,
        message,
      }: {
        message: Message;
        clientTempId: string;
      }) => {
        replaceItem(message, clientTempId);
        if (message.sender._id === userId) return;

        // In case of have someones remove you from group
        if (message.action === 'removeUser') {
          // If you are in the room, and you had been deleted => redirect to online conversation
          if (
            message.targetUsers?.find((user) => user._id === userId) &&
            message.room?._id == room._id
          ) {
            router.push(ROUTE_NAMES.ONLINE_CONVERSATION);
            return;
          }
        }

        const targetText = message.room?.isGroup
          ? message.room?.name
            ? message.room?.name
            : 'your group'
          : 'you';
        const content = convert(message.content);
        const messageNotify = `${message.sender.name} to ${targetText}: ${content} `;
        setNotification(messageNotify);
      },
    );
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE, (message: Message) => {
      if (guestId) {
        queryClient.invalidateQueries(['messages', room._id]);
      }
      queryClient.invalidateQueries(['message', message._id]);
      if (message.hasChild) {
        queryClient.invalidateQueries(['message-item-replies', message._id]);
        queryClient.invalidateQueries([
          USE_COUNT_UNREAD_CHILD_KEY,
          message._id,
        ]);
      }
    });
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.FORM.UPDATE, (message: Message) => {
      if (guestId) {
        console.log('--UPDATED-MESSAGE--', message);
        queryClient.invalidateQueries(['messages', room._id]);
        updateRecentFormStatus && updateRecentFormStatus(message._id);
      }
      queryClient.invalidateQueries(['message', message._id]);
    });
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE, (message: Message) => {
      updateItem(message);
      queryClient.invalidateQueries(['message', message._id]);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.NEW);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.FORM.UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaceItem, room._id, updateItem, userId, guestId]);
};
