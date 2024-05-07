import { useQuery } from '@tanstack/react-query';
import { messageApi } from '../../api';
import { use, useEffect, useMemo } from 'react';
import { User } from '@/features/users/types';
import { Avatar } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { useClickReplyMessage } from '../../hooks/use-click-reply-message';
import { useTranslation } from 'react-i18next';

export interface MessageItemReplyProps {
  messageId: string;
  isMe?: boolean;
}

export const MessageItemReply = ({
  messageId,
  isMe,
}: MessageItemReplyProps) => {
  const { data: messages } = useQuery({
    queryKey: ['message-item-replies', messageId],
    queryFn: () => messageApi.getReplies(messageId),
    enabled: !!messageId,
  });
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
          <div className="h-1/2 w-2 rounded-bl-sm border-b border-l border-neutral-50" />
        </div>
      )}
      <div className="flex h-fit w-fit items-center gap-1 rounded-xl border border-neutral-50 px-2 py-1">
        {uniqueUsers.map((user) => (
          <Avatar
            alt={user.name}
            key={user._id}
            src={user.avatar}
            className="h-4 w-4"
          />
        ))}

        <span className="text-sm text-primary">
          {messages.length > 1
            ? t('CONVERSATION.REPLIES', { num: messages.length })
            : t('CONVERSATION.REPLY', { num: messages.length })}
        </span>
      </div>
      {isMe && (
        <div>
          <div className="h-1/2 w-2 rounded-br-sm border-b border-r border-neutral-50" />
        </div>
      )}
    </div>
  );
};
