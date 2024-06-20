'use client';

import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import React from 'react';
import { Typography } from '../data-display';
import { Menu } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar.store';
import { Button } from '../actions';
import { useTranslation } from 'react-i18next';

const MobileDefender = ({
  descriptionKey = 'RESPONSIVE.DESKTOP_ONLY',
  titleKey,
  children,
  ...props
}: {
  descriptionKey?: string;
  titleKey?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const { t } = useTranslation('common');

  const { setOpenSidebar, openSidebar } = useSidebarStore();
  if (!isMobile) return children;
  return (
    <>
      {titleKey && (
        <div className="flex flex-row items-center justify-start">
          <Button.Icon
            onClick={() => setOpenSidebar(!openSidebar, true)}
            color="default"
            size="xs"
            variant={'ghost'}
            className={cn('md:hidden')}
          >
            <Menu />
          </Button.Icon>
          <Typography className=" flex flex-row items-center justify-between  space-y-0 text-base font-semibold text-neutral-800 dark:text-neutral-50">
            {t(titleKey)}
          </Typography>
        </div>
      )}
      <div
        {...props}
        className={cn(
          'flex size-full flex-col items-center justify-center gap-4 md:hidden',
          props.className,
        )}
      >
        <Image
          src="/desktop-only.svg"
          alt="Desktop only"
          width={400}
          height={400}
        />
        <Typography
          variant="h4"
          className="mt-5 text-center text-base text-neutral-800 dark:text-neutral-50"
        >
          {t(descriptionKey)}
        </Typography>
      </div>
    </>
  );
};

export default MobileDefender;
