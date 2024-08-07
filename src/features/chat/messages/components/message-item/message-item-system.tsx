import { useRoomSidebarTabs } from '@/features/chat/rooms/components/room-side/room-side-tabs/room-side-tabs.hook';
import { Message } from '../../types';
import { useTranslation } from 'react-i18next';
import useGenerateSystemMessageContent from '../../hooks/use-generate-system-message-content';

export interface MessageItemSystemProps {
  message: Message;
  isMe?: boolean;
}

export const MessageItemSystem = ({
  message,
  isMe,
}: MessageItemSystemProps) => {
  const { changeTab } = useRoomSidebarTabs();
  const { t } = useTranslation('common');
  const messageContent = useGenerateSystemMessageContent(message, isMe);
  return (
    <div className="mx-auto">
      <span className="break-word-mt inline-flex justify-center text-center text-sm font-light text-neutral-600 dark:text-neutral-200">
        {messageContent}
      </span>
      {message.action === 'pinMessage' && (
        <span
          onClick={() => changeTab('pinned')}
          className="inline-block cursor-pointer text-sm text-primary active:text-primary-700 md:hover:text-primary-600"
        >
          &nbsp;{t('COMMON.VIEW')}
        </span>
      )}
    </div>
  );
};
