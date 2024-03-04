'use client';

import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { HistoryIcon } from 'lucide-react';

import React, { forwardRef } from 'react';

export interface PhraseProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
  onClose?: () => void;
}

const Phrase = forwardRef<HTMLDivElement, PhraseProps>(
  ({ isSelected, className, onClose, ...props }, ref) => {
    return (
      <section
        ref={ref}
        {...props}
        className={cn(className, isSelected ? '' : 'hidden')}
      >
        <Typography className="flex h-[44px] w-full flex-row items-center gap-2 border-b px-2 py-1 text-left font-semibold">
          <HistoryIcon className="h-4 w-4" />
          Phrase
        </Typography>
      </section>
    );
  },
);
Phrase.displayName = 'Phrase';

export default Phrase;
