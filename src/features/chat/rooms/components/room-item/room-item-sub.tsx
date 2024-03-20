import { Avatar, AvatarGroup } from '@/components/data-display/avatar';
import { memo, useEffect, useMemo, useState } from 'react';

import { Message } from '@/features/chat/messages/types';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { getReadByUsers } from '@/features/chat/utils';
import { translateText } from '@/services/languages.service';
import { convert } from 'html-to-text';
import { useTranslation } from 'react-i18next';

const ItemSub = ({
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
  const {t} = useTranslation("common");
  const messageContent = useMemo(
    () => convert(message.content),
    [message.content],
  );
  const englishContent = useMemo(() => {
    return convert(message.contentEnglish ?? '');
  }, [message.contentEnglish]);

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
        (message.type === 'action' && messageContent.includes('pin'))) &&
      !isCurrentUserSender
    ) {
      return `${message.sender.name} `;
    }
    const isSystemMessage =
      message.type === 'notification' ||
      message.type === 'action' ||
      message.type === 'media' ||
      message.status === 'removed' ||
      (!messageContent && message.forwardOf) ||
      message.type === 'call';

    let actor = '';
    if (isGroup) {
      if (isCurrentUserSender) {
        actor = t('CONVERSATION.YOU');
      } else {
        actor = message.sender.name;
      }
    } else if (isCurrentUserSender) {
      actor = t('CONVERSATION.YOU');
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
    messageContent,
    message.forwardOf,
    currentUserId,
    isGroup,
    t
  ]);

  const content = useMemo(() => {
    switch (message.status) {
      case 'removed':
        return t('CONVERSATION.REMOVED_A_MESSAGE');
      default:
        break;
    }

    switch (message.type) {
      case 'media':
        if (message.media) {
          const mediaType = message.media[0]?.type;
          switch (mediaType) {
            case 'image':
              return message.media.length > 1 ? t('CONVERSATION.SEND_PHOTOS', {num: message.media.length}) : t('CONVERSATION.SEND_PHOTO');
            case 'document':
              return t('CONVERSATION.SEND_FILE');
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
          return `${messageContent} ${targetUserNamesString}`;
        }
        break;
      default:
        break;
    }
    if (!messageContent && message.forwardOf) {
      return t('CONVERSATION.FORWARDED_MESSAGE');
    }
    return messageContent;
  }, [
    messageContent,
    message.forwardOf,
    message.media,
    message.status,
    message.targetUsers,
    message.type,
    t
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
          englishContent || messageContent,
          message.sender.language,
          userLanguage,
        );
        setContentDisplay(translated);
      };
      translateContent();
      return;
    }

    if (message.type === 'call') {
      if (message?.call?.endTime) {
        setContentDisplay(t('CONVERSATION.CALL_ENDED'));
      } else {
        setContentDisplay(t('CONVERSATION.STARTED_CALL'));
      }
      return;
    } 

    if (message.type === 'action') {
      if(message.content.includes('unpin')) {
        setContentDisplay(t('CONVERSATION.UNPINNED_A_MESSAGE', {name: ''}))
        return;
      }

      if(message.content.includes('pin')) {
        setContentDisplay(t('CONVERSATION.PINNED_A_MESSAGE', {name: ''}))
        return;
      }
  
      if(message.content.includes('has created group')) {
        setContentDisplay(t('CONVERSATION.CREATED_GROUP', {name: ''}))
        return;
      }

      if(message.content.includes('left group')) {
        setContentDisplay(t('CONVERSATION.LEFT_GROUP', {name: ''}))
        return;
      }
  
      if(message.content.includes('change group name to')) {
        setContentDisplay(t('CONVERSATION.CHANGED_GROUP_NAME', {
          name: '',
          newName: message.content.split('group name to')[1]
        }))
        return;
      }

      if(message.content.includes('change group avatar')) {
        setContentDisplay(t('CONVERSATION.CHANGED_GROUP_AVATAR', {name: ''}))
        return;
      }

      if(message.content.includes('added')) {
        const targetUserNamesString = message?.targetUsers?.map((user) => user.name).join(', ');
        setContentDisplay(t('CONVERSATION.ADDED', {name: ''}) + " " + targetUserNamesString)
        return;
      }
  
      if(message.content.includes('removed')) {
        const targetUserNamesString = message?.targetUsers?.map((user) => user.name).join(', ');
        setContentDisplay(t('CONVERSATION.REMOVED', {name: ''})+ " " + targetUserNamesString)
        return;
      }
    }

    setContentDisplay(content);
  }, [userLanguage, message, content, messageContent, englishContent, t]);

  return (
    <div className="flex items-center">
      <Typography
        className={cn(
          'line-clamp-1 flex-1 break-all',
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
const MemoizedItemSub = memo(ItemSub);

export { MemoizedItemSub as ItemSub };
