'use client';

import { Typography } from '@/components/data-display';
import HelpDeskDropdownMenu from '@/components/layout/header/help-desk-dropdown-menu';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { use } from 'react';
import HelpDeskCallButton from './[businessId]/_components/call-button';
import { useBusinessNavigationData } from '@/hooks';

const LayoutBusiness = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isOnHelpDeskChat } = useBusinessNavigationData();
  return (
    <div className="full mx-auto flex h-full flex-col">
      <div
        className={cn(
          'z-50 flex h-header  w-full flex-row items-center justify-between rounded-t-[20px] border-b  border-neutral-50 bg-background ',
          {
            hidden: pathname?.endsWith(ROUTE_NAMES.WIDGET_NOTIFICATION),
          },
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
        <div className="flex flex-1 justify-end">
          <HelpDeskCallButton />
        </div>
        {isOnHelpDeskChat && <HelpDeskDropdownMenu />}
      </div>
      {children}
    </div>
  );
};

export default LayoutBusiness;
