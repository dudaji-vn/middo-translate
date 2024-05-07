'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/actions/button';
import { InfiniteScroll } from '@/components/infinity-scroll';
import { User } from '@/features/users/types';
import { ArrowDownIcon, Clock9Icon } from 'lucide-react';
import { Room } from '../../../rooms/types';
import { Message } from '../../types';
import { MessageItemGroup } from '../message-group';
import { MessageItem } from '../message-item';

import { useAuthStore } from '@/stores/auth.store';
import moment from 'moment';

import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import { useScrollIntoView } from '@/hooks/use-scroll-into-view';
import { cn } from '@/utils/cn';
import { TimeDisplay } from '../time-display';
import { useMessagesBox } from './messages-box.context';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { formatTimeDisplay } from '@/features/chat/rooms/utils';
import { useMessageActions } from '../message-actions';
export const MAX_TIME_DIFF = 60; // 1 hour
export const MAX_TIME_GROUP_DIFF = 1440; // 1 day
export type MessageGroup = {
  messages: Message[];
  lastMessage: Message;
};
export const MessageBox = ({
  room,
  isAnonymous,
  guestId,
}: {
  room: Room;
  isAnonymous?: boolean;
  guestId?: string;
}) => {
  const currentUserId = useAuthStore((s) => s.user?._id || guestId);
  const {
    hasNextPage,
    loadMoreMessages,
    messages,
    isFetching,
    pinnedMessages,
  } = useMessagesBox();

  const { ref, isScrolled } = useScrollDistanceFromTop(0, true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { scrollIntoView } = useScrollIntoView(bottomRef);
  const { isOnBusinessChat } = useBusinessNavigationData();
  const { message: messageEditing, action } = useMessageActions();

  const [participants, setParticipants] = useState(room.participants);

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

  return (
    <div className={cn('relative flex h-full w-full flex-1 overflow-hidden')}>
      <InfiniteScroll
        hasMore={hasNextPage || false}
        onLoadMore={loadMoreMessages}
        isFetching={isFetching}
        ref={ref}
        id="inbox-list"
        className="bg-primary/5 flex w-full flex-1 flex-col-reverse gap-2.5 overflow-x-hidden overflow-y-scroll px-2 pb-2 md:px-3"
      >
        <div ref={bottomRef} className="h-[0.1px] w-[0.1px]" />

        {messagesGroup.map((group, index) => {
          const isSendBySpaceMember = Boolean(
            isOnBusinessChat &&
              group.lastMessage.senderType !== 'anonymous' &&
              group.lastMessage.senderType !== 'user',
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
            <div key={group.lastMessage._id}>
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
                  <span
                    className={cn(
                      'flex items-center gap-1 text-xs font-light text-neutral-500',
                    )}
                  >
                    <Clock9Icon size={10} />{' '}
                    {formatTimeDisplay(group.lastMessage.createdAt!)}
                  </span>
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
                    return (
                      <MessageItem
                        isEditing={
                          message._id === messageEditing?._id &&
                          action === 'edit'
                        }
                        disabledAllActions={isAnonymous || room.isHelpDesk}
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
                        showTime={
                          message._id === group.lastMessage._id && !isSystem
                        }
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
      {isScrolled && (
        <Button.Icon
          size="xs"
          color="secondary"
          onClick={scrollIntoView}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <ArrowDownIcon className="text-primary" />
        </Button.Icon>
      )}
    </div>
  );
};
