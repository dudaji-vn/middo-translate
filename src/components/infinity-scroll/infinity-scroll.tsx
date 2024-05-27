import { forwardRef, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { Spinner } from '../feedback';
import { cn } from '@/utils/cn';

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadMore: () => void;
  onRefresh?: () => void;
  isFetching?: boolean;
  hasMore: boolean;
  scrollDirection?: 'to-top' | 'to-bottom';
  pullToRefresh?: boolean;
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
      ...props
    },
    ref,
  ) => {
    const { isIntersecting, ref: triggerRef } = useIntersectionObserver({
      threshold: 1,
    });

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshPosition, setRefreshPosition] = useState<number | null>(null);
    const startYRef = useRef<number | null>(null);

    useEffect(() => {
      if (isIntersecting && hasMore) {
        onLoadMore();
      }
    }, [isIntersecting, hasMore, onLoadMore]);

    const handleTouchStart = (event: React.TouchEvent) => {
      if (!pullToRefresh) return;
      if (window.scrollY === 0) {
        startYRef.current = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event: React.TouchEvent) => {
      if (!pullToRefresh || window.scrollY > 0) return;
      const startY = startYRef.current;
      if (startY !== null) {
        const currentY = event.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0) {
          event.preventDefault();
          setRefreshPosition(Math.min(distance, 130));
        }
      }
    };

    const handleTouchEnd = () => {
      if (!pullToRefresh) return;
      if (refreshPosition && refreshPosition > 100) {
        setIsRefreshing(true);
        if (onRefresh) {
          onRefresh();
        }
        setTimeout(() => setIsRefreshing(false), 1000); // Simulate refresh end
      }
      startYRef.current = null;
      setRefreshPosition(null);
    };

    return (
      <div
        ref={ref}
        {...props}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isRefreshing && (
          <div
            className={cn(
              'absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-50 p-2 text-primary',
              {
                'top-1': scrollDirection === 'to-bottom',
                'bottom-1': scrollDirection === 'to-top',
              },
            )}
          >
            <Spinner size="sm" />
          </div>
        )}
        {refreshPosition !== null && !isRefreshing && (
          <div
            style={{ top: refreshPosition + 96 }}
            className="fixed left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-50 p-2 text-primary"
          >
            <div
              style={{
                width: `${(refreshPosition / 130) * 20}px`,
                height: `${(refreshPosition / 130) * 20}px`,
                opacity: `${(refreshPosition / 130) * 0.8}`,
              }}
              className="rounded-full border-2 border-primary"
            ></div>
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
    );
  },
);
InfiniteScroll.displayName = 'InfiniteScroll';
