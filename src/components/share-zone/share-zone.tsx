'use client';

import { forwardRef } from 'react';
export interface ShareZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

export const ShareZone = forwardRef<HTMLDivElement, ShareZoneProps>(
  ({ text, ...props }, ref) => {
    const handleShare = () => {
      navigator.share({
        title: 'Join my conversation',
        text: 'Join my conversation at: ' + text,
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
