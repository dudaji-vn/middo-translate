import { useEffect, useRef } from 'react';

import { messageApi } from '../../api';
import { useAuthStore } from '@/stores/auth.store';
import { useHasFocus } from '@/features/chat/rooms/hooks/use-has-focus';
import { useIntersectionObserver } from 'usehooks-ts';
import { useMessageItem } from '.';
import { useMutation } from '@tanstack/react-query';

export interface SeenTrackProps {
  onSeen?: () => void;
}

export const SeenTracker = ({ onSeen }: SeenTrackProps) => {
  const { message } = useMessageItem();
  const userId = useAuthStore((state) => state!.user!._id);
  const isRead = message.readBy?.includes(userId);

  const { mutate } = useMutation({
    mutationFn: messageApi.seenMessage,
  });

  if (isRead || message.status === 'pending') {
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
  const messRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(messRef, {});

  const isFocused = useHasFocus();

  const isVisible = !!entry?.isIntersecting && isFocused;

  useEffect(() => {
    if (isVisible && onSeen) {
      onSeen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return <div ref={messRef} className="h-[0.1px] w-[0.1px]" />;
};
