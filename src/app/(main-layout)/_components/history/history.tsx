'use client';

import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { HistoryIcon, Paintbrush, XIcon } from 'lucide-react';
import React, { forwardRef, use, useEffect, useState } from 'react';
import { useHistoryStore } from '@/features/translate/stores/history.store';
import HistoryItem from './history-item';
import { cn } from '@/utils/cn';

export interface HistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
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
  ({ isSelected, className, onClose, ...props }, ref) => {
    const [isClient, setIsClient] = useState(false);
    const [historyListItems, clear, removeHistoryItem] = useHistoryStore((state) => [
      state.historyListItems,
      state.clear,
      state.removeHistoryItem,
    ]);
    useEffect(() => {
      setIsClient(true);
    }, []);
    if (!isClient) {
      return null;
    }
    const onDeleteHistoryItem = (item: THistoryItem) => {
      removeHistoryItem(item);
    };
    return (
      <section
        ref={ref}
        {...props}
        className={cn(
          className,
          isSelected
            ? 'h-full w-full space-y-4 !overflow-y-scroll [&_svg]:h-4 [&_svg]:w-4'
            : 'hidden',
        )}
      >
        <Typography className="relative flex h-11 w-full flex-row items-center gap-2 border-b px-2 py-1 text-left font-semibold text-primary-500-main">
          <HistoryIcon className="text-primary-500-main" />
          History
          <Button.Icon
            onClick={onClose}
            variant={'ghost'}
            size={'xs'}
            className="absolute right-2 top-1"
          >
            <XIcon />
          </Button.Icon>
        </Typography>
        <div className="flex h-[34px] w-full items-center justify-end gap-2 bg-background px-2 py-1 font-semibold">
          <Button
            variant={'ghost'}
            color={'default'}
            size={'xs'}
            onClick={clear}
            className="flex items-center gap-2 rounded-xl bg-neutral-50 text-neutral-700"
          >
            <Paintbrush />
            Clear all
          </Button>
        </div>
        <div className="flex w-full flex-col gap-8  px-2 ">
          {historyListItems?.map((item, index) => (
            <HistoryItem key={index} item={item} onDeleteItem={onDeleteHistoryItem}/>
          ))}
        </div>
      </section>
    );
  },
);
History.displayName = 'History';

export default History;
