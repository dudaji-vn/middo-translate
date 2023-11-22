'use client';

import { NEXT_PUBLIC_NAME } from '@/configs/env.public';
import { forwardRef } from 'react';
export interface ShareZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

export const ShareZone = forwardRef<HTMLDivElement, ShareZoneProps>(
  ({ text, ...props }, ref) => {
    const handleShare = () => {
      navigator.share({
        title: NEXT_PUBLIC_NAME,
        text: 'Join my conversation at: ',
        url: text,
      });
    };
    return (
      <div onClick={handleShare} ref={ref} {...props}>
        {props.children}
      </div>
    );
  },
);
ShareZone.displayName = 'ShareZone';
