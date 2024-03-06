'use client';

import { ReactNode, use, useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import History from './history/history';
import Phrases from './phrases/phrases';
import { useAppStore } from '@/stores/app.store';

const HomeTemplate = ({ children, searchParams }: { children: ReactNode, searchParams: any }) => {
  const pathname = usePathname();
  const currentTab = searchParams?.['tab'];
  const query = searchParams?.['query'];
  const currentInputLanguage = searchParams?.['source'] || 'auto';
  const { replace } = useRouter();
  const isMobile = useAppStore((state) => state.isMobile);
  const isValidTab = /phrases|history/.test(currentTab);

  const onCloseTab = useCallback(() => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    params.delete('tab');
    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, replace, pathname]);

  useEffect(() => {
    if(isMobile && isValidTab) {
      onCloseTab();
    }
  }, [query])

  if (!isValidTab) {
    return <main className={'h-full'}>{children}</main>;
  }
  return (
    <main className={'h-full '}>
      <div
        className={cn(
          'flex w-full flex-col divide-x max-md:gap-6 md:h-main-container-height md:flex-row',
        )}
      >
        <div className={cn('h-fit w-full md:w-3/4')}>{children}</div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className={cn(
              'max-h z-50 w-full border-l bg-background  md:relative md:z-auto md:h-auto md:w-1/3 xl:w-1/4'
              ,
              'absolute left-0 top-0 h-dvh '
            )
            }
          >
            <Phrases
              isSelected={currentTab === 'phrases'}
              onClose={onCloseTab}
              currentInputLanguage={currentInputLanguage}
            />
            <History
              isSelected={currentTab === 'history'}
              onClose={onCloseTab}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default HomeTemplate;
