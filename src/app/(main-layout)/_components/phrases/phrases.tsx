'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { ArrowLeft, SparklesIcon, XIcon } from 'lucide-react';

import React, { forwardRef } from 'react';
import PhrasesListItems from './phrase-list-items';
import { SearchParams } from '../../page';

export interface PhrasesProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
  onClose: () => void;
  searchParams: SearchParams;
}

const Phrases = forwardRef<HTMLDivElement, PhrasesProps>(
  ({ isSelected, searchParams, className, onClose, ...props }, ref) => {
    return (
      <section
        ref={ref}
        {...props}
        className={cn(
          className,
          isSelected
            ? 'h-full w-full space-y-2 !overflow-y-auto [&_svg]:h-4 [&_svg]:w-4 scroll-m-0 scroll-p-0'
            : 'hidden',
        )}
      >
        <div className=' flex w-full flex-row items-center md:flex-row-reverse border-b p-1 md:pl-3'>
          <Button.Icon
            onClick={onClose}
            variant={'ghost'}
            size={'xs'}
            color={'default'}
          >
            <XIcon className="max-md:hidden" />
            <ArrowLeft className="md:hidden" />
          </Button.Icon>
          <Typography
            className={cn(
              'flex w-full flex-row items-center gap-2  pl-1 pr-2 py-1 text-left font-semibold text-primary-500-main max-md:justify-center',
              'max-md:justify-center',
            )}
          >
            <SparklesIcon className="text-primary-500-main" />
            Phrases
          </Typography>
          <Button.Icon className='invisible md:hidden' />
        </div>
        <PhrasesListItems searchParams={searchParams} />
      </section>
    );
  },
);
Phrases.displayName = 'Phrases';

export default Phrases;
