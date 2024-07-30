'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { anounymousMessagesAPI } from '@/features/chat/help-desk/api/anonymous-message.service';
import { Message, PinMessage } from '@/features/chat/messages/types';
import { useGetPinnedMessages } from '@/features/chat/rooms/hooks/use-get-pinned-messages';
import { Room } from '@/features/chat/rooms/types';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useAuthStore } from '@/stores/auth.store';
import { useParams } from 'next/navigation';
import { roomApi } from '../../../rooms/api';
import { useChangeTitle } from './use-change-title';
import { useMessageSocket } from './use-message-socket';

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
  isFetched: boolean;
  isInitialLoading: boolean;
  recentlySubmitedFormByMessageId: string;
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
  const userId = useAuthStore((s) => s.user?._id);
  const [recentlySubmitedFormByMessageId, setRecentlySubmitedFormByMessageId] =
    useState<string>('');
  const [notification, setNotification] = useState<string>('');
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
    isFetched,
    isInitialLoading,
  } = useCursorPaginationQuery<Message>({
    queryKey: key,
    queryFn: ({ pageParam }) => {
      if (isAnonymous) {
        return anounymousMessagesAPI.getMessages(room._id, {
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
  const updateRecentFormStatus = useCallback(
    (messageId: string) => {
      if (messageId !== recentlySubmitedFormByMessageId)
        setRecentlySubmitedFormByMessageId(messageId);
    },
    [recentlySubmitedFormByMessageId],
  );

  useMessageSocket({
    room,
    userId: userId as string,
    guestId: guestId as string,
    replaceItem,
    updateItem,
    setNotification,
    triggerNewFlowMessage: updateRecentFormStatus,
  });

  useChangeTitle({
    notification,
    setNotification,
  });

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
        isFetched,
        isInitialLoading,
        recentlySubmitedFormByMessageId: recentlySubmitedFormByMessageId,
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
