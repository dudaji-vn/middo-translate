import { cn } from '@/utils/cn';
import { forwardRef, useEffect } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { Spinner } from '../feedback';

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadMore: () => void;
  onRefresh?: () => void;
  isFetching?: boolean;
  hasMore: boolean;
  scrollDirection?: 'to-top' | 'to-bottom';
  pullToRefresh?: boolean;
  isRefreshing?: boolean;
}

export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(
  (
    {
      hasMore,
      onLoadMore,
      onRefresh,
      isFetching,
      scrollDirection = 'to-bottom',
      pullToRefresh = false,
      isRefreshing = false,
      ...props
    },
    ref,
  ) => {
    const { isIntersecting, ref: triggerRef } = useIntersectionObserver({
      threshold: 1,
    });

    useEffect(() => {
      if (isIntersecting && hasMore) {
        onLoadMore();
      }
    }, [isIntersecting, hasMore, onLoadMore]);
    return (
      <>
        <div ref={ref} {...props} className={cn('relative', props.className)}>
          {isFetching && (
            <div
              className={cn(
                'absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-50 p-2 text-primary dark:bg-neutral-800',
                {
                  'top-1': scrollDirection === 'to-bottom',
                  'bottom-1': scrollDirection === 'to-top',
                },
              )}
            >
              <Spinner size="sm" />
            </div>
          )}

          {props.children}
          {isFetching && (
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 rounded-full p-2 text-primary opacity-30',
                {
                  'top-1': scrollDirection === 'to-bottom',
                  'bottom-1': scrollDirection === 'to-top',
                },
              )}
            >
              <Spinner size="sm" />
            </div>
          )}
          <div className="relative h-[1px] w-[1px]">
            <div
              ref={triggerRef}
              className={cn('absolute h-1 w-1', {
                'top-20': scrollDirection === 'to-top',
                'bottom-20': scrollDirection === 'to-bottom',
              })}
            />
          </div>
        </div>
      </>
    );
  },
);
InfiniteScroll.displayName = 'InfiniteScroll';
