'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { NEXT_PUBLIC_NAME } from '@/configs/env.public';
import { SOCKET_CONFIG } from '@/configs/socket';
import { Message, PinMessage } from '@/features/chat/messages/types';
import { useGetPinnedMessages } from '@/features/chat/rooms/hooks/use-get-pinned-messages';
import { Room } from '@/features/chat/rooms/types';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { convert } from 'html-to-text';
import { useParams, useRouter } from 'next/navigation';
import { roomApi } from '../../../rooms/api';
import { useHasFocus } from '../../../rooms/hooks/use-has-focus';
import { MessageActions } from '../message-actions';
import { anonymousMessagesAPI } from '@/features/chat/help-desk/api/anonymous-message.service';
import { ROUTE_NAMES } from '@/configs/route-name';

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
  isAnonymous,
  guestId,
}: PropsWithChildren<{
  room: Room;
  isAnonymous?: boolean;
  guestId?: string;
}>) => {
  const key = ['messages', room._id];
  const router = useRouter();
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
    queryFn: ({ pageParam }) => {
      if (isAnonymous) {
        return anonymousMessagesAPI.getMessages(room._id, {
          cursor: pageParam,
          limit: 16,
          userId: guestId as string,
        });
      }
      return roomApi.getMessages(room._id, { cursor: pageParam, limit: 16 });
    },
    config: {
      enabled: room.status !== 'temporary',
    },
  });
  const params = useParams<{ id: string }>();
  const { data } = useGetPinnedMessages({
    roomId: params?.id || room._id,
    isAnonymous,
  });

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
        console.log(`socket.on(${SOCKET_CONFIG.EVENTS.MESSAGE.NEW})`, message);
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
      queryClient.invalidateQueries(['message', message._id]);
      if (message.hasChild) {
        queryClient.invalidateQueries(['message-item-replies', message._id]);
      }
    });
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE, (message: Message) => {
      console.log('update message', message);
      updateItem(message);
      queryClient.invalidateQueries(['message', message._id]);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.NEW);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaceItem, room._id, updateItem, userId, guestId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (notification && !isFocused) {
      intervalId = setInterval(() => {
        const defaultTitle = `${NEXT_PUBLIC_NAME}`;
        document.title =
          document.title === `${NEXT_PUBLIC_NAME}`
            ? notification
            : defaultTitle;
      }, 1000);
    }
    if (isFocused) {
      document.title = `${NEXT_PUBLIC_NAME}`;
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
      {children}
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
