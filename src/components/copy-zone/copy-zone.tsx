'use client';

import { forwardRef } from 'react';
import { useTextCopy } from '@/hooks/use-text-copy';
export interface CopyZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

export const CopyZone = forwardRef<HTMLDivElement, CopyZoneProps>(
  ({ text, ...props }, ref) => {
    const { copy } = useTextCopy(text);
    return (
      <div onClick={copy.bind(null, text)} ref={ref} {...props}>
        {props.children}
      </div>
    );
  },
);
CopyZone.displayName = 'CopyZone';
