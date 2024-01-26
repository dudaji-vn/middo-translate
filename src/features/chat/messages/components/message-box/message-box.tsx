'use client';

import { useMemo, useRef } from 'react';

import { ArrowDownIcon } from 'lucide-react';
import { Button } from '@/components/actions/button';
import { InfiniteScroll } from '@/components/infinity-scroll';
import { Message } from '../../types';
import { MessageItem } from '../message-item';
import { MessageItemGroup } from '../message-group';
import { Room } from '../../../rooms/types';
import { User } from '@/features/users/types';
import { formatTimeDisplay } from '../../../rooms/utils';

import moment from 'moment';
import { useAuthStore } from '@/stores/auth.store';

import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import { useScrollIntoView } from '@/hooks/use-scroll-into-view';
import { useMessagesBox } from './messages-box.context';

export const MAX_TIME_DIFF = 5; // 5 minutes
export const MAX_TIME_GROUP_DIFF = 10; // 10 minutes
export type MessageGroup = {
  messages: Message[];
  lastMessage: Message;
};
export const MessageBox = ({ room }: { room: Room }) => {
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { hasNextPage, loadMoreMessages, messages, isFetching } =
    useMessagesBox();

  const { ref, isScrolled } = useScrollDistanceFromTop(0, true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { scrollIntoView } = useScrollIntoView(bottomRef);

  const messagesGroup = useMemo(() => {
    const data = messages?.reduce((acc, message) => {
      if (acc.length === 0) {
        acc.push({
          messages: [message],
          lastMessage: message,
        });
        return acc;
      }
      const lastGroup = acc[acc.length - 1];
      const lastMessage = lastGroup.lastMessage;
      // if last message is notification
      if (lastMessage.type === 'notification') {
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
            const user = room.participants.find(
              (u) => u._id === userId && u._id !== currentUserId,
            );
            if (user) {
              usersReadMessageMap[message._id].push(user);
            }
          });
        } else {
          message.readBy?.forEach((userId) => {
            if (!alreadyShow.includes(userId)) {
              const user = room.participants.find(
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
  }, [currentUserId, messagesGroup, room.participants]);

  return (
    <div className="relative flex h-full w-full flex-1 overflow-hidden">
      <InfiniteScroll
        hasMore={hasNextPage || false}
        onLoadMore={loadMoreMessages}
        isFetching={isFetching}
        ref={ref}
        id="inbox-list"
        className="bg-primary/5 flex w-full flex-1  flex-col-reverse gap-2 overflow-y-scroll px-3 pb-2 pt-6 md:px-5"
      >
        <div ref={bottomRef} className="h-[0.1px] w-[0.1px]" />

        {messagesGroup.map((group, index) => {
          const timeDiff = moment(moment(group.lastMessage.createdAt)).diff(
            messagesGroup[index + 1]?.messages[0].createdAt ?? moment(),
            'minute',
          );
          const isShowTimeGroup = timeDiff > MAX_TIME_GROUP_DIFF;
          const isMe = group.lastMessage.sender._id === currentUserId;
          const isSystem =
            group.lastMessage.type === 'notification' ||
            group.lastMessage.type === 'action';
          return (
            <div key={group.lastMessage._id}>
              {isShowTimeGroup && (
                <div className="my-2 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/30 h-[1px] w-16" />
                    <div className="text-sm font-light text-neutral-300">
                      {formatTimeDisplay(group.lastMessage.createdAt!)}
                    </div>
                    <div className="bg-primary/30 h-[1px] w-16" />
                  </div>
                </div>
              )}
              {!isMe && !isSystem && room.isGroup && (
                <div className="mb-0.5 pl-7 text-xs text-neutral-600">
                  <span>{group.lastMessage.sender.name}</span>
                </div>
              )}
              <div className="flex w-full gap-1">
                <MessageItemGroup>
                  {group.messages.map((message) => (
                    <MessageItem
                      showAvatar={
                        !isMe &&
                        !isSystem &&
                        message._id ===
                          group.messages[group.messages.length - 1]._id
                      }
                      key={message._id}
                      message={message}
                      sender={isMe ? 'me' : 'other'}
                      readByUsers={usersReadMessageMap[message._id] ?? []}
                    />
                  ))}
                </MessageItemGroup>
              </div>
            </div>
          );
        })}
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
