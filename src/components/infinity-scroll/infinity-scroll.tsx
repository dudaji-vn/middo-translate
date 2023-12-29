import { forwardRef, useEffect, useRef } from 'react';

import { Spinner } from '../feedback';
import { useIntersectionObserver } from 'usehooks-ts';

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadMore: () => void;
  isFetching?: boolean;
  hasMore: boolean;
}

export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(
  ({ hasMore, onLoadMore, isFetching, ...props }, ref) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(triggerRef, {});
    const isTriggered = !!entry?.isIntersecting;
    useEffect(() => {
      if (isTriggered && hasMore) {
        onLoadMore();
      }
    }, [isTriggered, hasMore, onLoadMore, isFetching]);

    return (
      <div ref={ref} {...props}>
        {props.children}
        {isFetching && (
          <div className="bg-primary/10 absolute left-1/2 top-6 -translate-x-1/2 rounded-full p-2 text-primary">
            <Spinner size="lg" />
          </div>
        )}
        <div className="relative h-[1px] w-[1px]">
          <div ref={triggerRef} className="absolute top-80"></div>
        </div>
      </div>
    );
  },
);
InfiniteScroll.displayName = 'InfiniteScroll';
