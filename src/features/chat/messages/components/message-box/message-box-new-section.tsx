import { useScrollIntoView } from '@/hooks';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

export interface MessageBoxNewSectionProps {
  onIntersected?: () => void;
}

export const MessageBoxNewSection = ({
  onIntersected,
}: MessageBoxNewSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isIntersecting, ref: intersectionRef } = useIntersectionObserver({
    threshold: 0.5,
  });
  const { scrollIntoView } = useScrollIntoView(ref);
  useEffect(() => {
    scrollIntoView();
    setTimeout(() => {
      scrollIntoView();
    }, 100);
  }, []);

  useEffect(() => {
    if (isIntersecting) {
      onIntersected?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);
  return (
    <div ref={ref} className="relative flex w-full items-center">
      <div className="h-[1px] flex-1 bg-primary"></div>
      <span
        ref={intersectionRef}
        className="p-3 text-sm font-semibold text-primary"
      >
        New
      </span>
      <div className="h-[1px] flex-1 bg-primary "></div>
    </div>
  );
};
