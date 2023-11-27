'use client';

import { forwardRef } from 'react';
import { useTextCopy } from '@/hooks/use-text-copy';
export interface CopyZoneClickProps
  extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

export const CopyZoneClick = forwardRef<HTMLDivElement, CopyZoneClickProps>(
  ({ text, ...props }, ref) => {
    const { copy } = useTextCopy(text);
    return (
      <div onClick={copy.bind(null, text)} ref={ref} {...props}>
        {props.children}
      </div>
    );
  },
);
CopyZoneClick.displayName = 'CopyZoneClick';
