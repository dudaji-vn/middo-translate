import { useRoomSidebarTabs } from '@/features/chat/rooms/components/room-side/room-side-tabs/room-side-tabs.hook';
import { Message } from '../../types';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { generateSystemMessageContent } from '../../utils';

export interface MessageItemSystemProps {
  message: Message;
  isMe?: boolean;
}

export const MessageItemSystem = ({
  message,
  isMe,
}: MessageItemSystemProps) => {
  const { changeTab } = useRoomSidebarTabs();
  const {t} = useTranslation('common')

  // const messageContent = useMemo(()=>{
  //   if(message.content.includes('pin')) {
  //     return t('CONVERSATION.PINNED_A_MESSAGE', {name: isMe ? t('CONVERSATION.YOU') : message.sender.name})
  //   }
  //   if(message.content.includes('unpin')) {
  //     return t('CONVERSATION.UNPINNED_A_MESSAGE', {name: isMe ? t('CONVERSATION.YOU') : message.sender.name})
  //   }

  //   if(message.content.includes('has created group')) {
  //     return t('CONVERSATION.CREATED_GROUP', {name: isMe ? t('CONVERSATION.YOU') : message.sender.name})
  //   }

  //   if(message.content.includes('left group')) {
  //     return t('CONVERSATION.LEFT_GROUP', {name: isMe ? t('CONVERSATION.YOU') : message.sender.name})
  //   }

  //   if(message.content.includes('change group name to')) {
  //     return t('CONVERSATION.CHANGED_GROUP_NAME', {
  //       name: isMe ? t('CONVERSATION.YOU') : message.sender.name,
  //       newName: message.content.split('change group name to')[1]
  //     })
  //   }

  //   if(message.content.includes('change group avatar')) {
  //     return t('CONVERSATION.CHANGED_GROUP_AVATAR', {name: isMe ? t('CONVERSATION.YOU') : message.sender.name})
  //   }

  //   if(message.content.includes('added')) {
  //     return t('CONVERSATION.ADDED', {name: isMe ? t('CONVERSATION.YOU') : message.sender.name})
  //   }

  //   if(message.content.includes('removed')) {
  //     return t('CONVERSATION.REMOVED', {name: isMe ? t('CONVERSATION.YOU') : message.sender.name})
  //   }

  //   return `${
  //     isMe ? t('CONVERSATION.YOU') : message.sender.name
  //   } ${message?.content}`

  // }, [isMe, message.content, message.sender.name, t])
  const actor = isMe ? 'You' : message.sender.name;
  const messageContent = useMemo(() => {
    const result = generateSystemMessageContent({
      action: message.action,
      content: message.content,
    });
    return result;
  }, [message]);

  return (
    <div className="mx-auto">
      <span className="break-word-mt text-sm font-light text-neutral-500">
        {actor}
        {messageContent}
        {message.targetUsers?.map((user, index) => {
          return !index ? ' ' + user.name : ', ' + user.name;
        })}
      </span>
      {message.action === 'pinMessage' && (
        <span
          onClick={() => changeTab('pinned')}
          className="cursor-pointer text-sm text-primary active:text-primary-700 md:hover:text-primary-600"
        >
          &nbsp;{t('COMMON.VIEW')}
        </span>
      )}
    </div>
  );
};
