import { useEffect, useRef } from 'react';

import { useIntersectionObserver } from 'usehooks-ts';

export interface SeenIndicatorProps {
  onSeen?: () => void;
}

export const SeenIndicator = ({ onSeen }: SeenIndicatorProps) => {
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
