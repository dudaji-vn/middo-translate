import { useEffect, useRef } from 'react';

import { messageApi } from '../../api';
import { useAuthStore } from '@/stores/auth.store';
import { useHasFocus } from '@/features/chat/rooms/hooks/use-has-focus';
import { useIntersectionObserver } from 'usehooks-ts';
import { useMessageItem } from '.';
import { useMutation } from '@tanstack/react-query';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

export interface SeenTrackProps {
  onSeen?: () => void;
  guestId?: string;
  hidden?: boolean;
}

export const SeenTracker = ({ onSeen, guestId, hidden }: SeenTrackProps) => {
  const { message } = useMessageItem();
  const storeUserId = useAuthStore((state) => state?.user?._id);
  const { isHelpDesk } = useBusinessNavigationData();
  const userId = storeUserId || guestId;
  const isRead = message.readBy?.includes(userId!);
  const { mutate } = useMutation({
    mutationFn: (id: string) => {
      return isHelpDesk
        ? messageApi.seenAnonymous(id, userId!)
        : messageApi.seen(id);
    },
  });

  if (isRead || message.status === 'pending' || hidden) {
    return null;
  }
  return (
    <Track
      onSeen={() => {
        onSeen?.();
        mutate(message._id);
      }}
    />
  );
};

export const Track = ({ onSeen }: SeenTrackProps) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0,
  });

  const isFocused = useHasFocus();

  const isVisible = isIntersecting && isFocused;

  useEffect(() => {
    if (isVisible && onSeen) {
      onSeen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return <div ref={ref} className="h-[0.1px] w-[0.1px]" />;
};
