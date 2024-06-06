'use client';

import { Typography } from '@/components/data-display';
import HelpDeskDropdownMenu from '@/components/layout/header/help-desk-dropdown-menu';
import { cn } from '@/utils/cn';
import { MessagesSquare, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  const [shrinked, setShrinked] = React.useState(false);
  const onTriggerBtnClick = () => {
    setShrinked(!shrinked);
  };
  return (
    <div className="h-screen space-y-1">
      <div
        className={cn(
          'helpdesk-widget-height  w-screen bg-opacity-0 ',
          'origin-[92%_100%] transform-gpu transition-all duration-300',
          shrinked ? 'scale-0' : 'scale-80',
        )}
      >
        <div
          className={cn(
            'z-50 flex h-header  w-full flex-row items-center justify-between gap-5 border-b  border-neutral-50 bg-background py-4 pl-[1vw] pr-[5vw] md:pl-[5vw]',
          )}
        >
          <div
            className={cn('flex flex-row items-center justify-start  gap-2')}
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
      <div
        className={
          'mx-auto flex  w-full flex-1 flex-row justify-end  max-sm:pr-2'
        }
      >
        <button
          onClick={onTriggerBtnClick}
          className="relative w-fit  rounded-full bg-white p-4 text-primary-500-main shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]"
        >
          <MessagesSquare className={`h-6 w-6`} />
        </button>
      </div>
    </div>
  );
};

export default layout;
