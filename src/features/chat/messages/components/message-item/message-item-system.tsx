import { useRoomSidebarTabs } from '@/features/chat/rooms/components/room-side/room-side-tabs/room-side-tabs.hook';
import { Message } from '../../types';
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
          &nbsp;View
        </span>
      )}
    </div>
  );
};
