'use client';

import { useEffect, useMemo, useState } from 'react';

import { InfiniteScroll } from '@/components/infinity-scroll/infinity-scroll-v2';
import { User } from '@/features/users/types';
import { Room } from '../../../rooms/types';
import { Message } from '../../types';
import { MessageItemGroup } from '../message-group';
import { MessageItem } from '../message-item';

import { useAuthStore } from '@/stores/auth.store';
import moment from 'moment';

import { roomApi } from '@/features/chat/rooms/api';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { useMessageActions } from '../message-actions';
import { TimeDisplay } from '../time-display';
import { useSearchParams } from 'next/navigation';
export const MAX_TIME_DIFF = 5; // 5 minutes
export const MAX_TIME_GROUP_DIFF = 30; // 1 day
export type MessageGroup = {
  messages: Message[];
  lastMessage: Message;
};
export const MessageBoxSearch = ({
  room,
  messageId,
  isAnonymous,
  guestId,
  pinnedMessages,
  setIsShowScrollToBottom,
}: {
  room: Room;
  messageId: string;
  isAnonymous?: boolean;
  guestId?: string;
  pinnedMessages?: { message: Message; pinnedBy: User }[];
  setIsShowScrollToBottom?: (value: boolean) => void;
}) => {
  const { data } = useQuery({
    queryKey: ['search-in-rooms', messageId],
    queryFn: () =>
      roomApi.getMessagesAroundMessage({
        roomId: room._id,
        messageId,
        params: { limit: 20 },
      }),
  });
  const searchParams = useSearchParams();
  const keyword = searchParams?.get('keyword') || '';
  const { isFetching, items, hasNextPage, fetchNextPage } =
    useCursorPaginationQuery<Message>({
      queryKey: ['prev-search-in-room', messageId],
      queryFn: ({ pageParam }) => {
        if (!pageParam) pageParam = data?.pageInfo?.endCursor;
        if (!pageParam)
          return Promise.resolve({
            items: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
              startCursor: null,
              hasPrevPage: false,
            },
          }) as any;
        return roomApi.getMessages(room._id, { cursor: pageParam, limit: 8 });
      },
      config: {
        enabled: !!data,
      },
    });

  const {
    items: nextItems,
    hasNextPage: nextHasNextPage,
    fetchNextPage: fetchNextNextPage,
  } = useCursorPaginationQuery<Message>({
    queryKey: ['next-search-in-room', messageId],
    queryFn: ({ pageParam }) => {
      if (!pageParam) pageParam = data?.pageInfo?.startCursor;
      if (!pageParam)
        return Promise.resolve({
          items: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
            startCursor: null,
            hasPrevPage: false,
          },
        }) as any;
      return roomApi.getMessages(room._id, {
        cursor: pageParam,
        limit: 8,
        direction: 'forward',
      });
    },
    config: {
      enabled: !!data,
    },
  });

  const currentUserId = useAuthStore((s) => s.user?._id);
  const { ref, isScrolled } = useScrollDistanceFromTop(0, true);
  const { isOnBusinessChat } = useBusinessNavigationData();
  const { message: messageEditing, action } = useMessageActions();

  const [participants, setParticipants] = useState(room.participants);

  useEffect(() => {
    if (data) {
      // settime out to scroll into view class active-message
      setTimeout(() => {
        const activeMessage = document.querySelector('.active-message');
        if (activeMessage) {
          activeMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }
      }, 1000);
    }
  }, [data]);

  const messages = useMemo(() => {
    if (!data) return [];
    return [...nextItems.reverse(), ...data.items, ...items];
  }, [data, items, nextItems]);

  useEffect(() => {
    setParticipants(room.participants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.participants.length]);

  const messagesGroup = useMemo(() => {
    const data = messages?.reduce((acc, message) => {
      if (acc.length === 0) {
        acc.push({
          messages: [message],
          lastMessage: message,
        });
        return acc;
      }
      if (message.type === 'action' || message.type === 'notification') {
        acc.push({
          messages: [message],
          lastMessage: message,
        });
        return acc;
      }
      const lastGroup = acc[acc.length - 1];
      const lastMessage = lastGroup.lastMessage;
      // if last message is notification
      if (
        lastMessage.type === 'notification' ||
        lastMessage.type === 'action'
      ) {
        acc.push({
          messages: [message],
          lastMessage: message,
        });
        return acc;
      }
      // if last message is not from the same sender
      if (lastMessage.sender._id !== message.sender._id) {
        acc.push({
          messages: [message],
          lastMessage: message,
        });
        return acc;
      }
      // if last message is from the same sender but time diff is too big
      const timeDiff = moment(lastMessage.createdAt).diff(
        moment(message.createdAt),
        'minute',
      );
      if (timeDiff > MAX_TIME_DIFF) {
        acc.push({
          messages: [message],
          lastMessage: message,
        });
      } else {
        lastGroup.messages.push(message);
        lastGroup.lastMessage = message;
      }
      return acc;
    }, [] as MessageGroup[]);

    return data;
  }, [messages]);

  const usersReadMessageMap = useMemo(() => {
    let alreadyShow: string[] = [];
    const usersReadMessageMap: { [key: string]: User[] } = {};
    messagesGroup.forEach((group, index) => {
      group.messages.forEach((message, messageIndex) => {
        if (index === 0 && messageIndex === 0) {
          alreadyShow = message.readBy ?? [];
          usersReadMessageMap[message._id] = [];
          message.readBy?.forEach((userId) => {
            const user = participants.find(
              (u) => u._id === userId && u._id !== currentUserId,
            );
            if (user) {
              usersReadMessageMap[message._id].push(user);
            }
          });
        } else {
          message.readBy?.forEach((userId) => {
            if (!alreadyShow.includes(userId)) {
              const user = participants.find(
                (u) => u._id === userId && u._id !== currentUserId,
              );
              if (user) {
                alreadyShow.push(userId);
                usersReadMessageMap[message._id] = [
                  ...(usersReadMessageMap[message._id] ?? []),
                  user,
                ];
              }
            }
          });
        }
      });
    });

    return usersReadMessageMap;
  }, [currentUserId, messagesGroup, participants]);

  useEffect(() => {
    setIsShowScrollToBottom?.(isScrolled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrolled]);

  return (
    <div className={cn('relative flex h-full w-full flex-1 overflow-hidden')}>
      <InfiniteScroll
        reverseHasMore={nextHasNextPage || false}
        onReverseLoadMore={fetchNextNextPage}
        scrollDirection="to-top"
        hasMore={hasNextPage || false}
        onLoadMore={fetchNextPage}
        isFetching={isFetching}
        ref={ref}
        id="inbox-list"
        className="bg-primary/5 flex w-full flex-1 flex-col-reverse gap-2.5 overflow-x-hidden overflow-y-scroll px-2 pb-2 md:px-3"
      >
        {messagesGroup.map((group, index) => {
          const isSendBySpaceMember = Boolean(
            isOnBusinessChat && group.lastMessage.senderType !== 'anonymous',
          );
          const timeDiff = moment(moment(group.lastMessage.createdAt)).diff(
            messagesGroup[index + 1]?.messages[0].createdAt ?? moment(),
            'minute',
          );
          const isShowTimeGroup = timeDiff > MAX_TIME_GROUP_DIFF;
          const isMe =
            (group.lastMessage.sender?._id === currentUserId &&
              currentUserId) ||
            isSendBySpaceMember;
          const isSystem =
            group.lastMessage.type === 'notification' ||
            group.lastMessage.type === 'action';

          return (
            <div key={group.lastMessage.clientTempId || group.lastMessage._id}>
              {isShowTimeGroup && (
                <TimeDisplay time={group.lastMessage.createdAt} />
              )}
              {!isSystem && (
                <div
                  className={cn(
                    'flex items-center gap-2 pl-7',
                    isMe ? 'justify-end' : '',
                  )}
                >
                  {!isMe && room.isGroup && (
                    <div className="break-word-mt mb-0.5 text-xs font-medium text-neutral-600">
                      <span>{group.lastMessage.sender.name}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex w-full gap-1">
                <MessageItemGroup>
                  {group.messages.map((message) => {
                    const pinnedBy = pinnedMessages?.find(
                      (pinnedMessage) =>
                        pinnedMessage.message._id === message._id,
                    )?.pinnedBy;
                    const newMessage = {
                      ...message,
                      isPinned: !!pinnedBy,
                    };
                    const isActive = message._id === messageId;
                    return (
                      <MessageItem
                        className={cn(isActive && 'active-message')}
                        isEditing={
                          message._id === messageEditing?._id &&
                          action === 'edit'
                        }
                        keyword={isActive ? keyword : undefined}
                        // actionsDisabled={room.isHelpDesk}
                        reactionDisabled={room.isHelpDesk}
                        guestId={guestId}
                        pinnedBy={pinnedBy}
                        showAvatar={
                          !isSendBySpaceMember &&
                          !isMe &&
                          !isSystem &&
                          message._id === group.lastMessage._id
                        }
                        spaceAvatar={
                          isAnonymous ? room.space?.avatar : undefined
                        }
                        isSendBySpaceMember={isSendBySpaceMember}
                        key={message?.clientTempId || message._id}
                        message={newMessage}
                        sender={isMe ? 'me' : 'other'}
                        readByUsers={usersReadMessageMap[message._id] ?? []}
                      />
                    );
                  })}
                </MessageItemGroup>
              </div>
            </div>
          );
        })}
        {!hasNextPage && (
          <TimeDisplay
            time={
              messagesGroup[messagesGroup.length - 1]?.messages[0].createdAt
            }
          />
        )}
      </InfiniteScroll>
    </div>
  );
};
