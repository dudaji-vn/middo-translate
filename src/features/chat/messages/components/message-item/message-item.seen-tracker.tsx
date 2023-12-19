import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/stores/auth';
import { useIntersectionObserver } from 'usehooks-ts';
import { useMessageItem } from '.';

export interface SeenTrackProps {
  onSeen?: () => void;
}

export const SeenTracker = ({ onSeen }: SeenTrackProps) => {
  const { message } = useMessageItem();
  const userId = useAuthStore((state) => state!.user!._id);
  const isRead = message.readBy?.includes(userId);

  if (isRead) {
    return null;
  }
  return <Track onSeen={onSeen} />;
};

export const Track = ({ onSeen }: SeenTrackProps) => {
  const messRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(messRef, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible && onSeen) {
      onSeen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return <div ref={messRef} className="h-[0.1px] w-[0.1px]" />;
};
