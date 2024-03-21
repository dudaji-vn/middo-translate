import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

export interface MessageItemPinnedProps {
  pinnedBy: User;
  isMe?: boolean;
}

export const MessageItemPinned = ({
  pinnedBy,
  isMe,
}: MessageItemPinnedProps) => {
  const {t} = useTranslation('common');
  const userId = useAuthStore((s) => s.user?._id);
  const isMePinned = pinnedBy._id === userId;
  const actor = isMePinned ? t('CONVERSATION.YOU') : pinnedBy.name;
  return (
    <div
      className={cn(
        'text-xs font-light text-neutral-800 ',
        isMe ? 'text-right' : 'text-left',
      )}
    >
      {t('CONVERSATION.PINED_BY', {name: actor})}
    </div>
  );
};
