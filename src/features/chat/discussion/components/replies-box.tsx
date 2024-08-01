import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessageActions } from '../../messages/components/message-actions';
import { MessageBoxNewSection } from '../../messages/components/message-box/message-box-new-section';
import {
  generateUsersReadMessageMap,
  groupMessages,
} from '../../messages/components/message-box/message-box-utils';
import { useGetFirstUnreadMessageId } from '../../messages/components/message-box/use-get-first-unread-message-id';
import { MessageItemGroup } from '../../messages/components/message-group';
import { MessageItem } from '../../messages/components/message-item';
import { TimeDisplay } from '../../messages/components/time-display';
import { roomApi } from '../../rooms/api';
import { useDiscussion } from './discussion';
export const MAX_TIME_DIFF = 5; // 5 minutes
export const MAX_TIME_GROUP_DIFF = 10; // 10 minutes

export interface RepliesBoxProps {}

export const RepliesBox = () => {
  const { replies, message: parent } = useDiscussion();
  const { message: messageEditing, action } = useMessageActions();
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { firstUnreadMessageId } = useGetFirstUnreadMessageId({
    messages: replies,
    currentUserId,
  });
  const messages = replies;
  const [participants, setParticipants] = useState(
    parent.room?.participants || [],
  );

  const { t } = useTranslation('common');
  const { data: room } = useQuery({
    queryKey: ['room', parent.room?._id],
    queryFn: () => roomApi.getRoom(parent.room?._id!),
    enabled: !!parent.room?._id,
  });
  const messagesGroup = useMemo(() => {
    return groupMessages(messages, [firstUnreadMessageId || '']);
  }, [messages, firstUnreadMessageId]);

  const usersReadMessageMap = useMemo(() => {
    return generateUsersReadMessageMap(
      messagesGroup,
      participants,
      currentUserId as string,
    );
  }, [currentUserId, messagesGroup, participants]);

  return (
    <>
      {messages.length > 0 && (
        <div className={'my-0.5 flex items-center justify-center gap-3'}>
          <div className="h-[1px] flex-1 bg-neutral-100 dark:bg-neutral-900" />
          <div className="flex items-center justify-center">
            <div className="bg-primary/30 h-[1px]" />
            <span className="text-xs font-light text-neutral-500 dark:text-neutral-200">
              {messages.length > 1
                ? t('CONVERSATION.REPLIES', { num: messages.length })
                : t('CONVERSATION.REPLY', { num: messages.length })}
            </span>
          </div>
          <div className="h-[1px] flex-1 bg-neutral-100 dark:bg-neutral-900" />
        </div>
      )}
      <div className="flex flex-1 flex-col-reverse justify-end gap-2 p-3">
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
              {firstUnreadMessageId === group.lastMessage._id && (
                <MessageBoxNewSection />
              )}
              {isShowTimeGroup && (
                <TimeDisplay time={group.lastMessage.createdAt} />
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
                <MessageItemGroup>
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
