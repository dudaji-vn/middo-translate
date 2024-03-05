'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { Lightbulb, SparklesIcon, XIcon } from 'lucide-react';

import React, { forwardRef } from 'react';
import PhrasesListItems from './phrase-list-items';

export interface PhrasesProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
  onClose?: () => void;
  hideTip: boolean;
  onTipClose: () => void;
  onShowTip: () => void;
}
const tipContent = `At here, you can select any topic to access our sample sentences for this situation. Or you could save your favorite sentences in “Your list" tab.`;

const Phrases = forwardRef<HTMLDivElement, PhrasesProps>(
  ({ isSelected, className, onClose, onTipClose, onShowTip, hideTip, ...props }, ref) => {
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
          <SparklesIcon className="text-primary-500-main" />
          Phrases
          <Button.Icon
            onClick={onClose}
            variant={'ghost'}
            size={'xs'}
            className="absolute right-2 top-1 text-neutral-600"
          >
            <XIcon />
          </Button.Icon>
        </Typography>
        <div
          className={cn(
            hideTip
              ? 'hidden'
              : 'flex w-full items-center justify-end gap-2 bg-background px-2 py-1 font-semibold',
          )}
        >
          <div className="flex h-auto w-full flex-col items-center justify-between gap-2 rounded-xl bg-neutral-50 p-2 text-neutral-700 ">
            <div className="flex w-full flex-row justify-between">
              <Typography className="font-open-sans flex items-center gap-1 text-left text-base font-medium leading-5 tracking-normal text-neutral-600">
                <Lightbulb />
                Welcome to phrases
              </Typography>
              <Button.Icon
                onClick={onTipClose}
                variant={'ghost'}
                size={'xs'}
                className="text-neutral-600"
              >
                <XIcon />
              </Button.Icon>
            </div>
            <Typography className="flex flex-row items-center gap-2 text-[14px] text-sm font-light leading-[18px] text-neutral-400">
              {tipContent}
            </Typography>
          </div>
        </div>
        <PhrasesListItems closeTip={onTipClose} showTip={onShowTip}/>
      </section>
    );
  },
);
Phrases.displayName = 'Phrases';

export default Phrases;
