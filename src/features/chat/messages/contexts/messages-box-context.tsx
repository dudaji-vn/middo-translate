'use client';

import { PropsWithChildren, createContext, useContext, useEffect } from 'react';

import { Message } from '@/features/chat/messages/types';
import { MessageActions } from '../components/message.actions';
import { Room } from '@/features/chat/rooms/types';
import { SOCKET_CONFIG } from '@/configs/socket';
import { roomApi } from '../../rooms/api';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';

interface MessagesBoxContextProps {
  room: Room;
  messages: Message[];
  loadMoreMessages: () => void;
  hasNextPage: boolean | undefined;
  refetchMessages: () => void;
  addMessage: (message: Message) => void;
  replaceMessage: (message: Message, clientTempId: string) => void;
  updateMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  isFetching: boolean;
}

export const MessagesBoxContext = createContext<MessagesBoxContextProps>(
  {} as MessagesBoxContextProps,
);

export const MessagesBoxProvider = ({
  children,
  room,
}: PropsWithChildren<{ room: Room }>) => {
  const key = ['messages', room._id];
  const {
    isFetching,
    items,
    hasNextPage,
    fetchNextPage,
    addItem,
    updateItem,
    removeItem,
    replaceItem,
  } = useCursorPaginationQuery<Message>({
    queryKey: key,
    queryFn: ({ pageParam }) =>
      roomApi.getMessages(room._id, { cursor: pageParam, limit: 16 }),
    config: {
      enabled: room.status !== 'temporary',
    },
  });

  const userId = useAuthStore((s) => s.user?._id);

  // socket event

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
        // const messageNotify = `${message.sender.name} to ${
        //   message.room?.isGroup && message.room?.name
        //     ? message.room?.name
        //     : 'your group'
        // }: ${message.content} `;
      },
    );
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE, (message: Message) => {
      updateItem(message);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.NEW);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE);
    };
  }, [replaceItem, room._id, updateItem, userId]);

  return (
    <MessagesBoxContext.Provider
      value={{
        room,
        messages: items,
        loadMoreMessages: fetchNextPage,
        hasNextPage: hasNextPage,
        refetchMessages: () => {},
        addMessage: addItem,
        replaceMessage: replaceItem,
        updateMessage: updateItem,
        removeMessage: removeItem,
        isFetching,
      }}
    >
      <MessageActions>{children}</MessageActions>
    </MessagesBoxContext.Provider>
  );
};

export const useMessagesBox = () => {
  const context = useContext(MessagesBoxContext);
  if (!context) {
    throw new Error('useMessagesBox must be used within MessagesBoxProvider');
  }
  return context;
};
