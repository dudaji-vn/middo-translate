import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';

export interface MessageItemPinnedProps {
  pinnedBy: User;
  isMe?: boolean;
}

export const MessageItemPinned = ({
  pinnedBy,
  isMe,
}: MessageItemPinnedProps) => {
  const userId = useAuthStore((s) => s.user?._id);
  const isMePinned = pinnedBy._id === userId;
  const actor = isMePinned ? 'You' : pinnedBy.name;
  return (
    <div
      className={cn(
        'text-xs font-light text-neutral-800 ',
        isMe ? 'text-right' : 'text-left',
      )}
    >
      Pinned by {actor}
    </div>
  );
};
