'use client';

import { useMemo, useRef } from 'react';

import { ArrowDownIcon } from 'lucide-react';
import { Avatar } from '@/components/data-display/avatar';
import { Button } from '@/components/actions/button';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Message } from '../types';
import { MessageItem } from './message-item';
import { MessageItemGroup } from './message-group';
import { Room } from '../../rooms/types';
import { Spinner } from '@/components/feedback/spinner';
import { User } from '@/features/users/types';
import { formatTimeDisplay } from '../../rooms/utils';
import { getReadByUsers } from '../../utils';
import moment from 'moment';
import { useAuthStore } from '@/stores/auth';
import { useMessagesBox } from '@/features/chat/messages/contexts';
import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import { useScrollIntoView } from '@/hooks/use-scroll-into-view';

const maxTimeDiff = 5; // 5 minutes
const maxTimeGroupDiff = 10; // 10 minutes
type MessageGroup = {
  messages: Message[];
  lastMessage: Message;
};
export const MessageBox = ({ room }: { room: Room }) => {
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { hasNextPage, loadMoreMessages, refetchMessages, messages } =
    useMessagesBox();

  const { ref, isScrolled } = useScrollDistanceFromTop(0, true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { scrollIntoView } = useScrollIntoView(bottomRef);

  const { messagesGroup, userAtMessage } = useMemo(() => {
    const userAtMessageRaw = room.participants.map(
      (participant) =>
        ({
          messageId: null,
          user: participant,
        }) as { messageId: Message['_id'] | null; user: User },
    );
    const data = messages?.reduce((acc, message) => {
      getReadByUsers({
        currentUserId: '1',
        readBy: message.readBy ?? [],
        participants: room.participants,
        senderId: message.sender._id,
      }).forEach((user) => {
        const userAtMessageIndex = userAtMessageRaw.findIndex(
          (u) => u.user._id === user._id,
        );
        if (
          userAtMessageIndex !== -1 &&
          !userAtMessageRaw[userAtMessageIndex].messageId
        ) {
          userAtMessageRaw[userAtMessageIndex].messageId = message._id;
        }
      });
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
      if (timeDiff > maxTimeDiff) {
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

    return {
      messagesGroup: data,
      userAtMessage: userAtMessageRaw.reduce(
        (acc, userAtMessage) => {
          if (userAtMessage.messageId) {
            acc[userAtMessage.messageId] = [
              ...(acc[userAtMessage.messageId] ?? []),
              userAtMessage.user,
            ];
          }
          return acc;
        },
        {} as { [key: Message['_id']]: User[] },
      ),
    } as {
      messagesGroup: MessageGroup[];
      userAtMessage: {
        [key: Message['_id']]: User[];
      };
    };
  }, [messages, room.participants]);

  const usersReadMessageMap = useMemo(() => {
    let alreadyShow: string[] = [];
    const usersReadMessageMap: { [key: string]: User[] } = {};
    messagesGroup.forEach((group, index) => {
      group.messages.forEach((message) => {
        if (index === 0 && group.lastMessage._id === message._id) {
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
              alreadyShow.push(userId);
              const user = room.participants.find(
                (u) => u._id === userId && u._id !== currentUserId,
              );
              if (user) {
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
      <div
        ref={ref}
        id="inbox-list"
        className="flex w-full flex-1 flex-col-reverse overflow-x-hidden overflow-y-scroll bg-primary/5 px-3 pb-2 pt-6 md:px-5"
      >
        <div ref={bottomRef} className="h-[0.1px] w-[0.1px]" />

        <InfiniteScroll
          scrollableTarget="inbox-list"
          dataLength={messagesGroup?.length || 0}
          next={loadMoreMessages}
          hasMore={hasNextPage || false}
          loader={
            <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-primary/10 p-2 text-primary">
              <Spinner size="lg" />
            </div>
          }
          refreshFunction={refetchMessages}
          inverse={true}
          scrollThreshold={0.7}
          className="flex flex-col-reverse gap-2"
          style={{
            height: 'none',
            overflow: 'visible',
          }}
        >
          {messagesGroup.map((group, index) => {
            const timeDiff = moment(moment(group.lastMessage.createdAt)).diff(
              messagesGroup[index + 1]?.messages[0].createdAt ?? moment(),
              'minute',
            );
            const isShowTimeGroup = timeDiff > maxTimeGroupDiff;
            const isMe = group.lastMessage.sender._id === currentUserId;
            const isNotify = group.lastMessage.type === 'notification';
            return (
              <div key={group.lastMessage._id}>
                {isShowTimeGroup && (
                  <div className="my-2 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-[1px] w-16 bg-primary/30" />
                      <div className="text-sm font-light text-colors-neutral-300">
                        {formatTimeDisplay(group.lastMessage.createdAt!)}
                      </div>
                      <div className="h-[1px] w-16 bg-primary/30" />
                    </div>
                  </div>
                )}
                {!isMe && !isNotify && room.isGroup && (
                  <div className="mb-0.5 pl-11 text-xs text-colors-neutral-600">
                    <span>{group.lastMessage.sender.name}</span>
                  </div>
                )}
                <div className="flex w-full gap-1">
                  <MessageItemGroup>
                    {group.messages.map((message) => (
                      <MessageItem
                        showAvatar={
                          !isMe &&
                          !isNotify &&
                          message._id === group.messages[0]._id
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
      </div>
      {isScrolled && (
        <Button.Icon
          size="sm"
          onClick={scrollIntoView}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-primary bg-background"
        >
          <ArrowDownIcon className="text-primary" />
        </Button.Icon>
      )}
    </div>
  );
};
