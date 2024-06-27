'use client';

import { Button } from '@/components/actions';
import { ROUTE_NAMES } from '@/configs/route-name';
import usePlatformNavigation from '@/hooks/use-platform-navigation';
import { cn } from '@/utils/cn';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const VerificationHeader = ({ redirectLink }: { redirectLink?: string }) => {
  const { navigateTo } = usePlatformNavigation();
  return (
    <div
      className={cn(
        'flex h-header w-full items-center justify-between gap-1 border-b border-neutral-50 bg-primary-100 py-4  pl-[1vw] pr-[5vw] dark:border-neutral-800 dark:bg-neutral-900 md:gap-5 md:pl-[5vw]',
      )}
    >
      <Button.Icon
        onClick={() => {
          navigateTo(redirectLink || ROUTE_NAMES.SPACES);
        }}
        variant={'ghost'}
        size={'xs'}
        color={'default'}
        className="text-neutral-600"
      >
        <ArrowLeft className="" />
      </Button.Icon>
    </div>
  );
};

export default VerificationHeader;
