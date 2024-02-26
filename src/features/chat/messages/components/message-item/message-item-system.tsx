import { useRoomSidebarTabs } from '@/features/chat/rooms/components/room-side/room-side-tabs/room-side-tabs.hook';
import { Message } from '../../types';

export interface MessageItemSystemProps {
  message: Message;
  isMe?: boolean;
}

export const MessageItemSystem = ({
  message,
  isMe,
}: MessageItemSystemProps) => {
  const { changeTab } = useRoomSidebarTabs();
  const messageContent = `${
    isMe ? 'You' : message.sender.name
  } ${message?.content}`;
  return (
    <div className="mx-auto">
      <span className="text-sm font-light text-neutral-500 line-clamp-1">
        {messageContent}
        {message.targetUsers?.map((user, index) => {
          return !index ? ' ' + user.name : ', ' + user.name;
        })}
      </span>
      {message.content.includes('pin') &&
        !message.content.includes('unpin') && (
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
