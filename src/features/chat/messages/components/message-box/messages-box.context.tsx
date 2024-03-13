'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Message, PinMessage } from '@/features/chat/messages/types';
import { MessageActions } from '../message-actions';
import { NEXT_PUBLIC_NAME } from '@/configs/env.public';
import { Room } from '@/features/chat/rooms/types';
import { SOCKET_CONFIG } from '@/configs/socket';
import { roomApi } from '../../../rooms/api';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useHasFocus } from '../../../rooms/hooks/use-has-focus';
import { useGetPinnedMessages } from '@/features/chat/rooms/hooks/use-get-pinned-messages';
import { useParams } from 'next/navigation';
import { convert } from 'html-to-text';
import { useQueryClient } from '@tanstack/react-query';

interface MessagesBoxContextProps {
  room: Room;
  messages: Message[];
  pinnedMessages: PinMessage[];
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
  const queryClient = useQueryClient();
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
  const params = useParams<{ id: string }>();
  const { data } = useGetPinnedMessages({ roomId: params?.id || room._id });

  const userId = useAuthStore((s) => s.user?._id);

  const [notification, setNotification] = useState<string>('');

  const isFocused = useHasFocus();

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
      updateItem(message);
      queryClient.invalidateQueries(['message', message._id]);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.NEW);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaceItem, room._id, updateItem, userId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (notification && !isFocused) {
      intervalId = setInterval(() => {
        const defaultTitle = `Talk | ${NEXT_PUBLIC_NAME}`;
        document.title =
          document.title === `Talk | ${NEXT_PUBLIC_NAME}`
            ? notification
            : defaultTitle;
      }, 1000);
    }
    if (isFocused) {
      document.title = `Talk | ${NEXT_PUBLIC_NAME}`;
      setNotification('');
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isFocused, notification]);

  return (
    <MessagesBoxContext.Provider
      value={{
        pinnedMessages: data ?? [],
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
