'use client';

import { ReactNode, useCallback } from 'react';
import Phrase, { PhraseProps } from './_components/phrase/phrase';
import History, { HistoryProps } from './_components/history/history';
import { cn } from '@/utils/cn';
import { PageLoading } from '@/components/feedback';
import { AnimatePresence, motion } from 'framer-motion';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

export type TTranslationTab = 'history' | 'phrases';

const HomeTemplate = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentTab = searchParams?.get('tab') as TTranslationTab;
  const { replace } = useRouter();
  const isValidTab = /phrases|history/.test(currentTab);

  const onCloseTab = useCallback(() => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    params.delete('tab');
    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, replace, pathname]);

  if (!isValidTab) {
    return (
      <main className={'h-full'}>
        <PageLoading title="Loading" className="h-full">
          {children}
        </PageLoading>
      </main>
    );
  }
  return (
    <main className={'h-full '}>
      <PageLoading title="Loading" className="h-full">
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
          
            className={
              'max-h  z-50 w-full border-l bg-background  md:relative md:z-auto md:h-auto md:w-1/4'
            }
          >
            <Phrase
              isSelected={currentTab === 'phrases'}
              onClose={onCloseTab}
            />
            <History
              isSelected={currentTab === 'history'}
              onClose={onCloseTab}
            />
          </motion.div>
          </AnimatePresence>
        </div>
      </PageLoading>
    </main>
  );
};

export default HomeTemplate;
