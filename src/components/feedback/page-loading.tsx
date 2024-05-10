'use client';

import { SvgSpinnersGooeyBalls1 } from '../icons';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { useTranslateStore } from '@/stores/translate.store';
import Image from 'next/image';

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
              'fixed bottom-0 left-0 right-0 top-0 z-[999] flex items-center justify-center bg-white/90',
            )}
          >
            <Image src='/loading-middo.gif' alt="Loading" width={100} height={100} />
          </div>
        )}
        <div className={isLoading ? 'hidden' : 'block'} {...props}>{props.children}</div>
      </>
    );
  },
);
PageLoading.displayName = 'PageLoading';
