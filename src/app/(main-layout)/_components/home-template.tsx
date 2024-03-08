'use client';

import { ReactNode, use, useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import History from './history/history';
import Phrases from './phrases/phrases';
import { useAppStore } from '@/stores/app.store';
import { SearchParams } from '../page';

const HomeTemplate = ({ children, searchParams }: { children: ReactNode, searchParams: SearchParams }) => {
  const pathname = usePathname();
  const currentTab = searchParams?.['tab'] || '';
  const query = searchParams?.['query'];
  const { replace } = useRouter();
  const isMobile = useAppStore((state) => state.isMobile);
  const isValidTab = /phrases|history/.test(currentTab);

  const onCloseTab = useCallback(() => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    params.delete('tab');
    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, replace, pathname]);

  useEffect(() => {
    if (isMobile && isValidTab) {
      onCloseTab();
    }
  }, [query])


  return (
    <main className={cn(isValidTab ?
      'flex w-full flex-col divide-x max-md:gap-6 md:h-main-container-height md:flex-row' : 'h-full'
    )}>
      <div className={isValidTab ? 'h-fit w-full md:w-3/4' : 'h-full'}>{children}</div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className={cn(
            'max-h z-50 w-full border-l bg-background  md:relative md:z-auto md:h-auto md:w-1/3 xl:w-1/4',
            'absolute inset-0 h-dvh ',
            isValidTab ? '' :'hidden'
          )
          }
        >
          <Phrases
            isSelected={currentTab === 'phrases'}
            onClose={onCloseTab}
            searchParams={searchParams}
          />
          <History
            isSelected={currentTab === 'history'}
            onClose={onCloseTab}
            searchParams={searchParams}
          />
        </motion.div>
      </AnimatePresence>

    </main>
  );
};

export default HomeTemplate;
