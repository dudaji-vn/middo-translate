import { useAuthStore } from '@/stores/auth.store';
import { useMemo } from 'react';
import moment from 'moment';
import { MessageGroup } from '../../messages/components/message-box';
import { deepCopy } from '@/utils/deep-copy';
import { User } from '@/features/users/types';
import { formatTimeDisplay } from '../../rooms/utils';
import { MessageItemGroup } from '../../messages/components/message-group';
import { MessageItem } from '../../messages/components/message-item';
import { useDiscussion } from './discussion';
import { useQuery } from '@tanstack/react-query';
import { roomApi } from '../../rooms/api';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { useMessageActions } from '../../messages/components/message-actions';
export const MAX_TIME_DIFF = 5; // 5 minutes
export const MAX_TIME_GROUP_DIFF = 10; // 10 minutes

export interface RepliesBoxProps {}

export const RepliesBox = () => {
  const { replies: messages, message: parent } = useDiscussion();
  const { message: messageEditing, action } = useMessageActions();
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { t } = useTranslation('common');
  const { data: room } = useQuery({
    queryKey: ['room', parent.room?._id],
    queryFn: () => roomApi.getRoom(parent.room?._id!),
    enabled: !!parent.room?._id,
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
        <div className={'my-0.5 flex items-center justify-center gap-3'}>
          <div className="h-[1px] flex-1 bg-neutral-100" />
          <div className="flex items-center justify-center">
            <div className="bg-primary/30 h-[1px]" />
            <span className="text-xs font-light text-neutral-500 dark:text-neutral-200">
              {messages.length > 1
                ? t('CONVERSATION.REPLIES', { num: messages.length })
                : t('CONVERSATION.REPLY', { num: messages.length })}
            </span>
          </div>
          <div className="h-[1px] flex-1 bg-neutral-100" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-3">
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
            <div key={group.messages[0]?.clientTempId || group.messages[0]._id}>
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
              <div
                className={cn(
                  'flex items-center gap-2 pl-7',
                  isMe ? 'justify-end' : '',
                )}
              >
                {!isMe && !isSystem && room?.isGroup && (
                  <div className="break-word-mt mb-0.5 text-xs font-medium text-neutral-600">
                    <span>{group.lastMessage.sender.name}</span>
                  </div>
                )}
              </div>
              <div className="flex w-full gap-1">
                <MessageItemGroup direction="top" className="flex-col">
                  {group.messages.map((message) => {
                    return (
                      <MessageItem
                        isDiscussion
                        isEditing={
                          parent._id === messageEditing?.parent?._id &&
                          message._id === messageEditing?._id &&
                          action === 'edit'
                        }
                        discussionDisabled
                        showReply={false}
                        showAvatar={
                          !isMe &&
                          !isSystem &&
                          message._id === group.messages[0]._id
                        }
                        key={message?.clientTempId || message._id}
                        message={message}
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
      </div>
    </>
  );
};
