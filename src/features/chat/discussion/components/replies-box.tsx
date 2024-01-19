import { useAuthStore } from '@/stores/auth.store';
import { useMemo } from 'react';
import moment from 'moment';
import {
  MAX_TIME_DIFF,
  MAX_TIME_GROUP_DIFF,
  MessageGroup,
} from '../../messages/components/message-box';
import { deepCopy } from '@/utils/deep-copy';
import { User } from '@/features/users/types';
import { formatTimeDisplay } from '../../rooms/utils';
import { MessageItemGroup } from '../../messages/components/message-group';
import { MessageItem } from '../../messages/components/message-item';
import { useDiscussion } from './discussion';
import { useQuery } from '@tanstack/react-query';
import { roomApi } from '../../rooms/api';

export interface RepliesBoxProps {}

export const RepliesBox = () => {
  const { replies: messages, message } = useDiscussion();
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { data: room } = useQuery({
    queryKey: ['room', message.room?._id],
    queryFn: () => roomApi.getRoom(message.room?._id!),
    enabled: !!message.room?._id,
  });
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
    if (!room?.participants) return {};
    let alreadyShow: string[] = [];
    const usersReadMessageMap: { [key: string]: User[] } = {};
    const newMessagesGroup = deepCopy(
      messagesGroup,
    ).reverse() as MessageGroup[];
    newMessagesGroup.forEach((group, index) => {
      group.messages.reverse().forEach((message, messageIndex) => {
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
  }, [currentUserId, messagesGroup, room?.participants]);

  return (
    <>
      {messages.length > 0 && (
        <div className="relative flex justify-center">
          <div className="absolute top-1/2 h-[1px] w-full bg-neutral-200"></div>
          <div className="relative bg-white p-1 text-sm text-neutral-400">
            {messages.length} {messages.length > 1 ? 'replies' : 'reply'}
          </div>
        </div>
      )}
      <div className="flex-1">
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
              {!isMe && !isSystem && room?.isGroup && (
                <div className="mb-0.5 pl-11 text-xs text-neutral-600">
                  <span>{group.lastMessage.sender.name}</span>
                </div>
              )}
              <div className="flex w-full gap-1">
                <MessageItemGroup direction="top" className="flex-col">
                  {group.messages.map((message) => (
                    <MessageItem
                      showReply={false}
                      showAvatar={
                        !isMe &&
                        !isSystem &&
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
      </div>
    </>
  );
};
