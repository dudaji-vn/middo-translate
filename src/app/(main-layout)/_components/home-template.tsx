'use client';

import { ReactNode } from 'react';
import Phrase, { PhraseProps } from './phrase/phrase';
import History, { HistoryProps } from './history/history';
import { cn } from '@/utils/cn';

export type TTranslationTab = 'history' | 'phrases';

const HomeTemplate = ({
  children,
  currentTab,
  phraseProps,
  historyProps,
}: {
  children: React.ReactNode;
  currentTab?: TTranslationTab;
  historyProps?: HistoryProps;
  phraseProps?: PhraseProps;
}) => {
  if (!currentTab || !/phrases|history/.test(currentTab)) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn('flex h-main-container-height w-full flex-row divide-x')}
    >
      <div className={cn('h-fit w-3/4 ')}>{children}</div>
      <div
        className={
          'max-h  z-50 w-1/4 border-l bg-background md:relative md:z-auto md:h-auto md:w-[26.5rem]'
        }
      >
        <Phrase
          {...phraseProps}
          {...(currentTab != 'phrases' && { className: 'hidden' })}
        />
        <History
          {...historyProps}
          {...(currentTab != 'history' && { className: 'hidden' })}
        />
      </div>
    </div>
  );
};
export default HomeTemplate;
