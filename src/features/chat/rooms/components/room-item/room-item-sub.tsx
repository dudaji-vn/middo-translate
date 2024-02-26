import { Avatar, AvatarGroup } from '@/components/data-display/avatar';
import { useEffect, useMemo, useState } from 'react';

import { Message } from '@/features/chat/messages/types';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { getReadByUsers } from '@/features/chat/utils';
import { translateText } from '@/services/languages.service';

export const ItemSub = ({
  message,
  participants,
  isGroup,
  currentUser,
}: {
  message: Message;
  participants: User[];
  currentUser: User;
  isGroup: boolean;
}) => {
  const currentUserId = currentUser?._id;
  const userLanguage = currentUser.language;
  const isRead = message.readBy?.includes(currentUserId);
  const readByUsers = useMemo(() => {
    return getReadByUsers({
      readBy: message.readBy ?? [],
      participants,
      currentUserId,
      senderId: message.sender._id,
      showOthers: false,
    });
  }, [message.readBy, message.sender._id, participants, currentUserId]);

  const preMessage = useMemo(() => {
    const isCurrentUserSender = message.sender._id === currentUserId;
    if (message.type === 'call' && message.call?.endTime) {
      return '';
    }

    if (
      (message.type === 'call' ||
        (message.type === 'action' && message.content.includes('pin'))) &&
      !isCurrentUserSender
    ) {
      return `${message.sender.name} `;
    }
    const isSystemMessage =
      message.type === 'notification' ||
      message.type === 'action' ||
      message.type === 'media' ||
      message.status === 'removed' ||
      (!message?.content && message.forwardOf) ||
      message.type === 'call';

    let actor = '';
    if (isGroup) {
      if (isCurrentUserSender) {
        actor = 'You';
      } else {
        actor = message.sender.name.split(' ')[0];
      }
    } else if (isCurrentUserSender) {
      actor = 'You';
    }

    if (isSystemMessage) {
      actor += ' ';
    } else {
      if (isGroup) {
        actor += ': ';
      } else actor += isCurrentUserSender ? ': ' : ' ';
    }
    return actor;
  }, [
    message.sender._id,
    message.sender.name,
    message.type,
    message.call?.endTime,
    message.status,
    message?.content,
    message.forwardOf,
    currentUserId,
    isGroup,
  ]);

  const content = useMemo(() => {
    switch (message.status) {
      case 'removed':
        return 'unsent a message';
      default:
        break;
    }

    switch (message.type) {
      case 'media':
        if (message.media) {
          const mediaType = message.media[0]?.type;
          switch (mediaType) {
            case 'image':
              return `sent ${message.media.length} photo${
                message.media.length > 1 ? 's' : ''
              }`;
            case 'document':
              return 'sent file';
            default:
              break;
          }
        }
        break;
      case 'action':
        if (message.targetUsers && message.targetUsers.length > 0) {
          const targetUserNamesString = message.targetUsers
            .map((user) => user.name)
            .join(', ');
          return `${message.content} ${targetUserNamesString}`;
        }
        break;
      default:
        break;
    }
    if (!message?.content && message.forwardOf) {
      return `forwarded a message`;
    }
    return message.content;
  }, [
    message.content,
    message.forwardOf,
    message.media,
    message.status,
    message.targetUsers,
    message.type,
  ]);

  const [contentDisplay, setContentDisplay] = useState(content);
  useEffect(() => {
    if (message.type === 'text') {
      if (userLanguage === message.sender.language) {
        setContentDisplay(content);
        return;
      }
      const translateContent = async () => {
        const translated = await translateText(
          message.contentEnglish || message.content,
          message.sender.language,
          userLanguage,
        );
        setContentDisplay(translated);
      };
      translateContent();
    }
    if (message.type === 'call') {
      if (message?.call?.endTime) {
        setContentDisplay('Call ended');
      } else {
        setContentDisplay('started a call');
      }
    } else {
      setContentDisplay(content);
    }
  }, [userLanguage, message, content]);

  return (
    <div className="flex items-center">
      <Typography
        className={cn(
          'line-clamp-1 break-all',
          isRead ? 'text-text opacity-80' : 'font-medium',
        )}
      >
        {preMessage} {contentDisplay}
      </Typography>
      {!isRead && <div className="ml-auto h-3 w-3 rounded-full bg-primary" />}
      {readByUsers.length > 0 && (
        <div className="ml-auto flex items-center pl-2">
          <AvatarGroup
            avatarClassName="w-4 h-4"
            className="space-x-0.5 text-[0.625rem]"
            limit={3}
          >
            {readByUsers.map((user) => (
              <Avatar key={user._id} alt={user.name} src={user.avatar} />
            ))}
          </AvatarGroup>
        </div>
      )}
    </div>
  );
};
