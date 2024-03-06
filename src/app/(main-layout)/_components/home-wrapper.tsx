'use client';

import { ReactNode, Suspense, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import History from './history/history';
import Phrases from './phrases/phrases';
import { TranslationTab } from '@/types/translationstab.type';

const HomeWrapper = ({
  children,
  searchParams,
}: {
  children: ReactNode;
  searchParams?: {
    tab?: TranslationTab;
    query?: string;
    source?: string;
    target?: string;
  };
}) => {
  const pathname = usePathname();
  const currentTab = searchParams?.['tab'] as TranslationTab;
  const { replace } = useRouter();
  const isValidTab = /phrases|history/.test(currentTab);

  const onCloseTab = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('tab');
    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, replace, pathname]);

  if (!isValidTab) {
    return <Suspense><main className={'h-full'}>{children}</main></Suspense>;
  }
  return (
    <Suspense>
      <main className={'h-full '}>
        <div
          className={cn(
            'flex w-full flex-col divide-x max-md:gap-6 md:h-main-container-height md:flex-row',
          )}
        >
          <div
            className={cn(
              'h-fit w-full md:w-2/3 xl:w-3/4',
              isValidTab && 'max-md:hidden',
            )}
          >
            {children}
          </div>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className={
                'max-h  z-50 w-full border-l bg-background  md:relative md:z-auto md:h-auto md:w-1/3 xl:w-1/4'
              }
            >
              <Phrases
                isSelected={currentTab === TranslationTab.PHRASES}
                onClose={onCloseTab}
              />
              <History
                isSelected={currentTab === TranslationTab.HISTORY}
                onClose={onCloseTab}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </Suspense>
  );
};

export default HomeWrapper;
