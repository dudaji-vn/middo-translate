'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { ArrowLeft, SparklesIcon, XIcon } from 'lucide-react';

import React, { forwardRef, } from 'react';
import PhrasesListItems from './phrase-list-items';

export interface PhrasesProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
  onClose?: () => void;
}

const Phrases = forwardRef<HTMLDivElement, PhrasesProps>(
  ({ isSelected, className, onClose, ...props }, ref) => {
    return (
      <section
        ref={ref}
        {...props}
        className={cn(
          className,
          isSelected
            ? 'h-full w-full space-y-2 !overflow-y-scroll [&_svg]:h-4 [&_svg]:w-4'
            : 'hidden',
        )}
      >
        <Typography
          className={cn(
            'relative flex h-11 w-full flex-row items-center gap-2 border-b px-2 py-1 text-left font-semibold text-primary-500-main max-md:justify-center',
            'max-md:justify-center',
          )}
        >
          <SparklesIcon className="text-primary-500-main" />
          Phrases
          <Button.Icon
            onClick={onClose}
            variant={'ghost'}
            size={'xs'}
            className={cn(
              'absolute top-0 text-neutral-600 max-md:left-2 md:right-2 md:top-1',
            )}
          >
            <XIcon className="max-md:hidden" />
            <ArrowLeft className="md:hidden" />
          </Button.Icon>
        </Typography>

        <PhrasesListItems />
      </section>
    );
  },
);
Phrases.displayName = 'Phrases';

export default Phrases;
