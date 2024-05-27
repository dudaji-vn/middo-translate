import { Avatar, AvatarGroup } from '@/components/data-display/avatar';
import { memo, useEffect, useMemo, useState } from 'react';

import { Message } from '@/features/chat/messages/types';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { getReadByUsers } from '@/features/chat/utils';
import { convert } from 'html-to-text';
import { useTranslation } from 'react-i18next';
import { generateSystemMessageContent } from '@/features/chat/messages/utils';
import { messageApi } from '@/features/chat/messages/api';
import { Room } from '../../types';
import { Clock9, LogOut } from 'lucide-react';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';

const ItemSub = ({
  message,
  participants,
  expiredAt = '',
  isGroup,
  currentUser,
}: {
  message: Message;
  participants: User[];
  currentUser: User;
  isGroup: boolean;
  expiredAt?: Room['expiredAt'];
}) => {
  const currentUserId = currentUser?._id;
  const isMe = message.sender._id === currentUserId;
  const userLanguage = currentUser.language;
  const { isBusiness } = useBusinessNavigationData();
  const isRead = message.readBy?.includes(currentUserId);
  const { t } = useTranslation('common');
  const messageContent = useMemo(
    () =>
      convert(message.content, {
        selectors: [{ selector: 'a', options: { ignoreHref: true } }],
      }),
    [message.content],
  );
  const englishContent = useMemo(() => {
    return convert(message.translations?.en ?? '', {
      selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    });
  }, [message.translations?.en]);

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
        message.action === 'leaveHelpDesk' ||
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
    message.action,
    message.status,
    message.forwardOf,
    currentUserId,
    messageContent,
    isGroup,
    t,
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
              return message.media.length > 1
                ? t('CONVERSATION.SEND_PHOTOS', { num: message.media.length })
                : t('CONVERSATION.SEND_PHOTO');
            case 'document':
              return t('CONVERSATION.SEND_FILE');
            case 'video':
              return t('CONVERSATION.SEND_VIDEO');
            default:
              return t('CONVERSATION.SEND_FILE');
          }
        }
        break;
      case 'action':
        let targetUserNamesString = '';
        if (message.targetUsers && message.targetUsers.length > 0) {
          targetUserNamesString = message.targetUsers
            .map((user) => user.name)
            .join(', ');
        }
        return `${generateSystemMessageContent({
          action: message.action,
          content: messageContent,
        })} ${targetUserNamesString}`;

      default:
        break;
    }

    if (!messageContent && message.forwardOf) {
      return t('CONVERSATION.FORWARDED_MESSAGE');
    }
    return messageContent;
  }, [
    messageContent,
    message.action,
    message.forwardOf,
    message.media,
    message.status,
    message.targetUsers,
    message.type,
    t,
  ]);

  const [contentDisplay, setContentDisplay] = useState(content);
  useEffect(() => {
    if (
      message.type === 'text' &&
      message.status !== 'removed' &&
      !message.forwardOf
    ) {
      if (userLanguage === message.language || isMe) {
        setContentDisplay(content);
        return;
      }
      const translateContent = async () => {
        let translated = message.translations?.[userLanguage];
        if (!translated) {
          try {
            const messageRes = await messageApi.translate({
              id: message._id,
              to: userLanguage,
            });
            if (messageRes.translations)
              translated = messageRes.translations[userLanguage];
          } catch (error) {
            console.error('Translate error', error);
          }
        }
        setContentDisplay(
          convert(translated || message.content, {
            selectors: [{ selector: 'a', options: { ignoreHref: true } }],
          }),
        );
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
      const targetUserNamesString = message?.targetUsers
        ?.map((user) => user.name)
        .join(', ');
      switch (message.action) {
        case 'addUser':
          setContentDisplay(
            t('CONVERSATION.ADDED', {
              name: '',
              members: targetUserNamesString,
            }),
          );
          return;
        case 'removeUser':
          setContentDisplay(
            t('CONVERSATION.REMOVED', {
              name: '',
              members: targetUserNamesString,
            }),
          );
          return;
        case 'leaveGroup':
          setContentDisplay(
            t('CONVERSATION.LEFT_GROUP', {
              name: '',
            }),
          );
          return;
        case 'pinMessage':
          setContentDisplay(
            t('CONVERSATION.PINNED_A_MESSAGE', {
              name: '',
            }),
          );
          return;
        case 'unpinMessage':
          setContentDisplay(
            t('CONVERSATION.UNPINNED_A_MESSAGE', {
              name: '',
            }),
          );
          return;
        case 'updateGroupName':
          setContentDisplay(
            t('CONVERSATION.CHANGED_GROUP_NAME', {
              name: '',
              newName: message.content,
            }),
          );
          return;
        case 'updateGroupAvatar':
          setContentDisplay(
            t('CONVERSATION.CHANGED_GROUP_AVATAR', {
              name: '',
            }),
          );
          return;
        case 'removeGroupName':
          setContentDisplay(
            t('CONVERSATION.REMOVED_GROUP_NAME', {
              name: '',
            }),
          );
          return;
        case 'createGroup':
          setContentDisplay(
            t('CONVERSATION.CREATED_GROUP', {
              name: '',
            }),
          );
          return;
        case 'leaveHelpDesk':
          setContentDisplay(
            t('CONVERSATION.LEFT_HELP_DESK', {
              name: '',
            }),
          );
          return;
        default:
          setContentDisplay(message.content);
          return;
      }
    }

    setContentDisplay(content);
  }, [userLanguage, message, content, messageContent, englishContent, t, isMe]);

  const isExpired = new Date(expiredAt || '') < new Date();
  const isVisitorLeft =
    message.type === 'action' && message.action === 'leaveHelpDesk';

  return (
    <div className="flex items-center">
      <div className="flex w-full flex-row items-center justify-between gap-1 ">
        <Typography
          className={cn(
            'line-clamp-1 flex-1 break-all',
            isRead ? 'text-text opacity-80' : 'font-medium',
          )}
        >
          {preMessage} {contentDisplay}
        </Typography>
      </div>
      {!isRead && <div className="ml-auto h-3 w-3 rounded-full bg-primary" />}
      {isExpired && (
        <Tooltip
          title={
            'This conversation is expired because the visitor not active for a long time'
          }
          triggerItem={<Clock9 className=" ml-1 size-4 text-error-500" />}
        />
      )}
      {isVisitorLeft && (
        <Tooltip
          title={'Visitor left this conversation'}
          triggerItem={<LogOut className=" ml-1 size-4 text-error-500" />}
        />
      )}
      {readByUsers.length > 0 && !isBusiness && (
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
