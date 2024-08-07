import { Avatar } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { messageApi } from '../../../api';
import { useClickReplyMessage } from '../../../hooks/use-click-reply-message';
import { useCountUnreadChild } from '../../../hooks/use-count-unread-child';
import Ping from '@/components/data-display/ping';

export interface MessageItemReplyProps {
  messageId: string;
  isMe?: boolean;
}

const MAX_USER_SHOWN = 5;

export const MessageItemReply = ({
  messageId,
  isMe,
}: MessageItemReplyProps) => {
  const { data: messages } = useQuery({
    queryKey: ['message-item-replies', messageId],
    queryFn: () => messageApi.getReplies(messageId),
    enabled: !!messageId,
  });
  const { data } = useCountUnreadChild(messageId);
  const isNew = data?.count ? data.count > 0 : false;
  const { t } = useTranslation('common');
  const { onClickReplyMessage } = useClickReplyMessage();
  const uniqueUsers = useMemo(() => {
    if (!messages) return [];
    return messages.reduce((acc, message) => {
      if (!acc.find((user) => user._id === message.sender._id)) {
        acc.push(message.sender);
      }
      return acc;
    }, [] as User[]);
  }, [messages]);

  const usersShown = uniqueUsers.slice(0, MAX_USER_SHOWN);

  if (!messages?.length) return null;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClickReplyMessage(messageId);
      }}
      className={cn(
        'mt-0.5 flex cursor-pointer',
        isMe ? 'justify-end' : 'justify-start',
      )}
    >
      {!isMe && (
        <div>
          <div
            className={cn(
              'h-1/2 w-2 rounded-bl-sm border-b border-l border-neutral-100 dark:border-neutral-600',
              isNew && '!border-primary',
            )}
          />
        </div>
      )}
      <div
        className={cn(
          'relative flex h-fit w-fit items-center gap-1 rounded-xl border border-neutral-100 px-3 py-2 dark:border-neutral-600 md:rounded-lg md:px-2 md:py-1',
          isNew && '!border-primary',
        )}
      >
        {usersShown.map((user) => (
          <Avatar
            alt={user.name}
            key={user._id}
            src={user.avatar}
            className="h-6 w-6 md:h-4 md:w-4"
          />
        ))}
        {/* remain count */}
        {uniqueUsers.length > MAX_USER_SHOWN && (
          <div
            className=" flex h-6 w-6 items-center justify-center rounded-full bg-neutral-50 text-sm text-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 md:h-4 md:w-4 md:text-xs
          "
          >
            +{uniqueUsers.length - MAX_USER_SHOWN}
          </div>
        )}

        <span
          className={cn(
            'text-sm text-primary',
            isNew ? 'font-semibold' : 'text-neutral-600',
          )}
        >
          {messages.length > 1
            ? t('CONVERSATION.REPLIES', { num: messages.length })
            : t('CONVERSATION.REPLY', { num: messages.length })}
        </span>
        {isNew && <Ping size={8} className="ml-1" />}
      </div>
      {isMe && (
        <div>
          <div
            className={cn(
              'h-1/2 w-2 rounded-br-sm border-b border-r border-neutral-100 dark:border-neutral-700',
              isNew && '!border-primary',
            )}
          />
        </div>
      )}
    </div>
  );
};
