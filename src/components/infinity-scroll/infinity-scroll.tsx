import { forwardRef, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { Spinner } from '../feedback';
import { cn } from '@/utils/cn';
import { usePullToRefresh } from '@/hooks/use-pull-down-to-refesh';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RotateCwIcon } from 'lucide-react';

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
    // ref,
  ) => {
    const ref = useRef<HTMLDivElement>(null);
    const { isIntersecting, ref: triggerRef } = useIntersectionObserver({
      threshold: 1,
    });
    const { currentY } = usePullToRefresh({
      ref: ref as React.RefObject<HTMLElement>,
      onRefresh,
    });

    useEffect(() => {
      if (isIntersecting && hasMore) {
        onLoadMore();
      }
    }, [isIntersecting, hasMore, onLoadMore]);
    return (
      <>
        <IndicatorAnimation isRefreshing={isRefreshing} input={currentY} />
        <div ref={ref} {...props} className={cn('relative', props.className)}>
          {isFetching && (
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
const IndicatorAnimation = ({
  input,
  isRefreshing,
}: {
  input: number;
  isRefreshing?: boolean;
}) => {
  const x = useMotionValue(0);
  x.set(input);

  // const scale = useTransform(x, [0, 300], [0, 1]);
  const top = useTransform(x, [0, 150], [0, 52]);
  const rotate = useTransform(x, [0, 300], [0, 360]);
  return (
    <div className="absolute left-0 right-0 z-50 flex w-full justify-center">
      {isRefreshing ? (
        <div
          className={cn(
            'absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-neutral-50 p-2 text-primary',
          )}
        >
          <Spinner size="sm" />
        </div>
      ) : (
        <motion.div
          style={{
            translateY: -36,
            top,
          }}
          className="absolute top-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-50 text-primary"
        >
          <motion.div
            style={{
              rotate,
            }}
          >
            <RotateCwIcon />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
