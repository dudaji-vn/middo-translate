'use client';

import { SvgSpinnersGooeyBalls1 } from '../icons';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { useTranslateStore } from '@/stores/translate';

interface PageLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const PageLoading = forwardRef<HTMLDivElement, PageLoadingProps>(
  (props, ref) => {
    const { isLoading } = useTranslateStore();
    return (
      <>
        {isLoading && (
          <div
            className={cn(
              'fixed left-0 top-0 right-0 bottom-0 z-[999] flex items-center justify-center bg-black/20',
            )}
          >
            <SvgSpinnersGooeyBalls1 className="h-[32px] w-[32px] text-primary" />
            <p>{props.title}</p>
          </div>
        )}
        <div className={isLoading ? 'hidden' : 'block'}>{props.children}</div>
      </>
    );
  },
);
PageLoading.displayName = 'PageLoading';
