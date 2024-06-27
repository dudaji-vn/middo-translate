import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useQueryClient } from '@tanstack/react-query';
import { use, useEffect, useState } from 'react';
import { Message } from '../../types';
import { convert } from 'html-to-text';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/features/chat/rooms/types';

export const useMessageSocket = ({
  room,
  userId,
  guestId,
  replaceItem,
  updateItem,
  setNotification,
}: {
  replaceItem: (message: Message, clientTempId: string) => void;
  room: Room;
  updateItem: (message: Message) => void;
  userId: string;
  guestId: string;
  setNotification: (message: string) => void;
}) => {
  const [isCounting, setIsCounting] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [canCount, setCanCount] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    setNewCount(0);
    setCanCount(false);
  }, [room._id]);

  useEffect(() => {
    if (isCounting) {
      setIsCounting(false);
      if (!canCount) return;
      setNewCount((prev) => prev + 1);
    }
  }, [isCounting, canCount]);

  useEffect(() => {
    if (canCount) return;
    setNewCount(0);
  }, [canCount]);

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
        console.log(`socket.on(${SOCKET_CONFIG.EVENTS.MESSAGE.NEW})`, message);
        replaceItem(message, clientTempId);
        if (message.sender._id === userId) return;
        setIsCounting(true);

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
      queryClient.invalidateQueries(['message', message._id]);
      if (message.hasChild) {
        queryClient.invalidateQueries(['message-item-replies', message._id]);
      }
    });
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE, (message: Message) => {
      updateItem(message);
      queryClient.invalidateQueries(['message', message._id]);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.NEW);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaceItem, room._id, updateItem, userId, guestId]);
  return { newCount, canCount, setCanCount };
};
