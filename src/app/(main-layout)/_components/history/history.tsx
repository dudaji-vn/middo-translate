'use client';

import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { HistoryIcon, Paintbrush } from 'lucide-react';
import React, { forwardRef, use, useEffect } from 'react';
import { useHistoryStore } from '@/features/translate/stores/history.store';
import HistoryItem from './history-item';

export interface HistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  sourceLanguage?: string;
  targetLanguage?: string;
  sourceText?: string;
  targetResult?: string;
  sourceEnglishResult?: string;
  targetEnglishResult?: string;
  sourceTranslateResult?: string;
}
export type THistoryData = {
  language: string;
  content: string;
  englishContent?: string;
};
export type THistoryItem = {
  src: THistoryData;
  dest: THistoryData;
};
export type THistoryListItems = THistoryItem[];

const History = forwardRef<HTMLDivElement, HistoryProps>(
  (
    {
      sourceEnglishResult,
      targetEnglishResult,
      sourceLanguage,
      targetLanguage,
      sourceText,
      targetResult,
      sourceTranslateResult,
      ...props
    },
    ref,
  ) => {
    const { pushHistoryItem, historyListItems } = useHistoryStore();
    useEffect(() => {
      if (
        sourceText &&
        targetResult &&
        sourceTranslateResult &&
        sourceEnglishResult &&
        targetEnglishResult &&
        sourceLanguage &&
        targetLanguage
      ) {
        pushHistoryItem({
          src: {
            language: sourceLanguage || '',
            content: sourceText,
            englishContent: sourceEnglishResult,
          },
          dest: {
            language: targetLanguage || '',
            content: targetResult,
            englishContent: targetEnglishResult,
          },
        });
      }
    }, [
      sourceText,
      targetResult
    ]);

    return (
      <section
        className="h-full space-y-4 !overflow-y-scroll [&_svg]:h-4 [&_svg]:w-4"
        ref={ref}
        {...props}
      >
        <Typography className="flex h-11 w-full flex-row items-center gap-2 border-b px-2 py-1 text-left font-semibold text-primary-500-main">
          <HistoryIcon className="text-primary-500-main" />
          History
        </Typography>
        <div className="flex h-[34px] w-full items-center justify-end gap-2 bg-background px-2 py-1 font-semibold">
          <Button
            variant={'ghost'}
            color={'default'}
            size={'sm'}
            onClick={() => {}}
            className="flex items-center gap-2 rounded-xl bg-neutral-50 text-neutral-700"
          >
            <Paintbrush />
            Clear all
          </Button>
        </div>
        <div className="flex w-full flex-col gap-8  px-2 ">
          {historyListItems?.map((item, index) => (
            <HistoryItem key={index} src={item.src} dest={item.dest} />
          ))}
        </div>
      </section>
    );
  },
);
History.displayName = 'History';

export default History;
