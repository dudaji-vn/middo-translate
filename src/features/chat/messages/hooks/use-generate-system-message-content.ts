import { useTranslation } from 'react-i18next';
import { Message } from '../types';
import { useMemo } from 'react';

export default function useGenerateSystemMessageContent(
  message: Message,
  isMe?: boolean,
) {
  const { t } = useTranslation('common');

  const messageContent = useMemo(() => {
    const targetUsers = message.targetUsers?.map((user, index) => {
      return ' ' + user.name;
    });
    switch (message.action) {
      case 'addUser':
        return t('CONVERSATION.ADDED', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
          members: targetUsers,
        });
      case 'removeUser':
        return t('CONVERSATION.REMOVED', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
          members: targetUsers,
        });
      case 'leaveGroup':
        return t('CONVERSATION.LEFT_GROUP', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
        });
      case 'pinMessage':
        return t('CONVERSATION.PINNED_A_MESSAGE', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
        });
      case 'unpinMessage':
        return t('CONVERSATION.UNPINNED_A_MESSAGE', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
        });
      case 'updateGroupName':
        return t('CONVERSATION.CHANGED_GROUP_NAME', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
          newName: message.content,
        });
      case 'updateGroupAvatar':
        return t('CONVERSATION.CHANGED_GROUP_AVATAR', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
        });
      case 'removeGroupName':
        return t('CONVERSATION.REMOVED_GROUP_NAME', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
        });
      case 'createGroup':
        return t('CONVERSATION.CREATED_GROUP', {
          name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
        });
      default:
        return message.content;
    }
  }, [
    message.targetUsers,
    message.action,
    message.sender.name,
    message.content,
    t,
    isMe,
  ]);
  return messageContent;
}
