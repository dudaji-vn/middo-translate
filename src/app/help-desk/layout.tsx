import { Typography } from '@/components/data-display';
import HelpDeskDropdownMenu from '@/components/layout/header/help-desk-dropdown-menu';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="full mx-auto flex h-full flex-col">
      <div
        className={cn(
          'z-50 flex h-header  w-full flex-row items-center justify-between gap-5 rounded-t-[20px] border-b  border-neutral-50 bg-background ',
        )}
      >
        <div
          className={cn('flex flex-row items-center justify-start gap-2   p-1')}
        >
          <Typography className={' ml-5 min-w-14 text-xs text-neutral-600'}>
            Power by
          </Typography>
          <Image src="/logo.png" priority alt="logo" width={50} height={50} />
        </div>
        <HelpDeskDropdownMenu />
      </div>
      {children}
    </div>
  );
};

export default layout;
