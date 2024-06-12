'use client';

import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { ArrowLeft, HistoryIcon, Paintbrush, XIcon } from 'lucide-react';
import React, { forwardRef, use, useEffect, useState } from 'react';
import { useHistoryStore } from '@/features/translate/stores/history.store';
import HistoryItem from './history-item';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { SvgSpinnersGooeyBalls1 } from '@/components/icons';
import { usePathname, useRouter } from 'next/navigation';
import { isEqual } from 'lodash';
import { SearchParams } from '../../translation/page';
import { useTranslateStore } from '@/stores/translate.store';
import useClient from '@/hooks/use-client';
import { useTranslation } from 'react-i18next';
import { ROUTE_NAMES } from '@/configs/route-name';

export interface HistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
  searchParams: SearchParams;
  onClose?: () => void;
}
export type THistoryData = {
  language: string;
  content: string;
  englishContent?: string;
};
export type THistoryItem = {
  id: string;
  src: THistoryData;
  dest: THistoryData;
};
export type THistoryListItems = THistoryItem[];

const History = forwardRef<HTMLDivElement, HistoryProps>(
  ({ isSelected, searchParams, className, onClose, ...props }, ref) => {
    const isClient = useClient();
    const router = useRouter();
    const { setValue: setTranslateEditorInputValue } = useTranslateStore();
    const [historyListItems, clear, removeHistoryItem] = useHistoryStore(
      (state) => [state.historyListItems, state.clear, state.removeHistoryItem],
    );

    const isMobile = useAppStore((state) => state.isMobile);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { t } = useTranslation('common');
    useEffect(() => {
      setIsLoading(false);
    }, [searchParams]);

    if (!isClient) {
      return null;
    }
    const onDeleteHistoryItem = (item: THistoryItem) => {
      removeHistoryItem(item);
    };
    const handleHistoryClick = async ({ dest, src }: THistoryItem) => {
      const newParams = {
        source: src.language,
        target: dest.language,
        query: src.content.trim(),
        ...(isMobile ? {} : { tab: 'history' }),
      };
      if (!isEqual(searchParams, newParams)) {
        setIsLoading(true);
      }
      router.replace(
        `/${ROUTE_NAMES.TRANSLATION}?${new URLSearchParams(newParams).toString()}`,
      );
      setTranslateEditorInputValue(src.content.trim());
    };
    return (
      <section
        ref={ref}
        {...props}
        className={cn(
          className,
          isSelected
            ? 'h-full w-full space-y-4 !overflow-y-auto [&_svg]:h-4 [&_svg]:w-4'
            : 'hidden',
        )}
      >
        {isLoading && (
          <div
            className={cn(
              'fixed bottom-0 left-0 right-0 top-0 z-[999] flex items-center justify-center bg-black/20',
            )}
          >
            <SvgSpinnersGooeyBalls1 className="h-[32px] w-[32px] text-primary" />
          </div>
        )}
        <Typography
          className={cn(
            'relative flex  h-11 w-full flex-row items-center gap-2 border-b px-3 py-1 pr-1 text-left font-semibold text-primary-500-main dark:border-neutral-900',
            'max-md:justify-center',
          )}
        >
          <HistoryIcon className="text-primary-500-main" />
          {t('TRANSLATION.HISTORY')}
          <Button.Icon
            onClick={onClose}
            variant={'ghost'}
            size={'xs'}
            color={'default'}
            className={cn(
              'absolute top-0 text-neutral-600 max-md:left-2 md:right-2 md:top-1',
            )}
          >
            <XIcon className="max-md:hidden" />
            <ArrowLeft className="md:hidden" />
          </Button.Icon>
        </Typography>
        <div className="flex h-[34px] w-full items-center justify-end gap-2 bg-background px-3 py-1 font-semibold">
          <Button
            variant={'ghost'}
            color={'default'}
            size={'xs'}
            onClick={() => {
              onClose?.();
              clear();
            }}
            className="flex items-center gap-2 rounded-xl bg-neutral-50 text-neutral-700"
          >
            <Paintbrush />
            {t('COMMON.CLEAR_ALL')}
          </Button>
        </div>
        <div className="flex w-full flex-col gap-8  px-3 pb-8">
          {historyListItems?.map((item, index) => (
            <HistoryItem
              onClick={() => {
                handleHistoryClick(item);
              }}
              key={index}
              item={item}
              index={index}
              onDeleteItem={onDeleteHistoryItem}
            />
          ))}
        </div>
      </section>
    );
  },
);
History.displayName = 'History';

export default History;
