'use client';

import { SvgSpinnersGooeyBalls1 } from '../icons';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { useTranslateStore } from '@/stores/translate';
export interface PageLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
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
              'fixed left-1/2 top-1/2 flex h-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center',
            )}
          >
            <SvgSpinnersGooeyBalls1 className="h-[32px] w-[32px] text-secondary" />
            <p>{props.title}</p>
          </div>
        )}
        <div className={isLoading ? 'hidden' : 'block'}>{props.children}</div>
      </>
    );
  },
);
PageLoading.displayName = 'PageLoading';
