import { forwardRef, useEffect, useRef } from 'react';

import { useIntersectionObserver } from 'usehooks-ts';
import { Spinner } from '../feedback';

interface InfiniteScrollWithLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoadMore: () => void;
  isFetching?: boolean;
  hasMore: boolean;
}

export const InfiniteScrollWithLoading = forwardRef<HTMLDivElement, InfiniteScrollWithLoadingProps>(
  ({ hasMore, onLoadMore, isFetching, ...props }, ref) => {
    const pageEndRef = useRef(null);
    useEffect(() => {
      if (hasMore) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            onLoadMore();
          }
        });
  
        if (pageEndRef.current) {
          observer.observe(pageEndRef.current);
        }
  
        return () => {
          if (pageEndRef.current) {
            observer.unobserve(pageEndRef.current);
          }
        };
      }
    }, [hasMore, onLoadMore]);

    return (
      <div ref={ref} {...props}>
        {props.children}
        {isFetching && (
          <div className="bg-primary/10 absolute left-1/2 top-1 -translate-x-1/2 rounded-full p-2 text-primary opacity-30">
            <Spinner size="sm" />
          </div>
        )}
        <div className="relative h-[1px] w-[1px] bg-transparent" ref={pageEndRef} >
          <div ref={pageEndRef} className="absolute top-80"></div>
        </div>
      </div>
    );
  },
);
InfiniteScrollWithLoading.displayName = 'InfiniteScrollWithLoading';
