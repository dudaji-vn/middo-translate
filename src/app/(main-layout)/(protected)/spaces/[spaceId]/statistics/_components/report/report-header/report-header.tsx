'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/data-display';
import ReportPickerDomain from './report-picker-domain';
import ReportPickerMember from './report-picker-member';
import ReportPickerTime from './report-picker-time';
import { Button } from '@/components/actions';
import { useSidebarStore } from '@/stores/sidebar.store';
import { cn } from '@/utils/cn';
import { Menu } from 'lucide-react';

export type ReportHeaderProps = {};

const ReportHeader = ({ ...props }: ReportHeaderProps) => {
  const { t } = useTranslation('common');
  const { openSidebar, setOpenSidebar, expand, setExpandSidebar } =
    useSidebarStore();

  return (
    <section className="relative w-full space-y-4 px-3 md:px-10">
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
          {t('EXTENSION.REPORT')}
        </Typography>
      </div>
      <div className="flex w-full flex-col justify-between gap-4 pb-4 md:flex-row">
        <ReportPickerDomain />
        <ReportPickerMember />
        <ReportPickerTime />
      </div>
    </section>
  );
};

export default ReportHeader;
