'use client';

import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect } from 'react';
import { SearchParams } from '../translation/page';
import History from './history/history';
import Phrases from './phrases/phrases';

const HomeTemplate = ({
  children,
  searchParams,
}: {
  children: ReactNode;
  searchParams: SearchParams;
}) => {
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
  }, [query]);

  return (
    <main
      className={cn(
        isValidTab
          ? 'container-height flex w-full flex-col divide-x max-md:gap-6 md:flex-row'
          : '',
      )}
    >
      <AnimatePresence>
        <div
          className={
            isValidTab ? 'w-full flex' : 'h-full'
          }
        >
          {children}
          {isValidTab && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={cn(
                'right-0 top-0 z-50 w-full border-l dark:border-neutral-900 bg-background md:top-[52px] md:w-1/3 ',
                isMobile ? 'fixed full-screen-height' : 'container-height',
              )}
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
          )}
        </div>
        
      </AnimatePresence>
    </main>
  );
};

export default HomeTemplate;
