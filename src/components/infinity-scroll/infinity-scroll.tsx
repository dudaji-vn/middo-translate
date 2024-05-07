import { forwardRef, useEffect } from 'react';

import { useIntersectionObserver } from 'usehooks-ts';
import { Spinner } from '../feedback';

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadMore: () => void;
  isFetching?: boolean;
  hasMore: boolean;
}

export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(
  ({ hasMore, onLoadMore, isFetching, ...props }, ref) => {
    const { isIntersecting, ref: triggerRef } = useIntersectionObserver({
      threshold: 1,
    });
    useEffect(() => {
      if (isIntersecting && hasMore) {
        onLoadMore();
      }
    }, [isIntersecting, hasMore, onLoadMore]);

    return (
      <div ref={ref} {...props}>
        {props.children}
        {isFetching && (
          <div className="bg-primary/10 absolute left-1/2 top-1 -translate-x-1/2 rounded-full p-2 text-primary opacity-30">
            <Spinner size="sm" />
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
