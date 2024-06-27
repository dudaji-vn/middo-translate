import { Typography } from '@/components/data-display';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReportHeader } from '../report-header';
import { Button } from '@/components/actions';
import { Menu } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useSidebarStore } from '@/stores/sidebar.store';

const EmptyReport = () => {
  const { t } = useTranslation('common');
  const { openSidebar, setOpenSidebar, expand, setExpandSidebar } =
    useSidebarStore();
  return (
    <section className="flex h-full w-full flex-col justify-between dark:bg-background">
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
        <Typography className=" flex flex-row items-center justify-between  space-y-0 text-base font-semibold text-neutral-800  dark:text-neutral-50">
          {t('EXTENSION.REPORT')}
        </Typography>
      </div>
      <div className="m-auto flex flex-grow flex-col justify-center gap-5 space-y-4">
        <Image
          src="/empty_report.svg"
          width={10}
          height={10}
          alt="Empty-report"
          className="h-auto w-[500px] max-w-full"
        />
        <Typography className="flex w-full items-center justify-center text-neutral-800 dark:text-neutral-50">
          Empty data at this time
        </Typography>
      </div>
    </section>
  );
};

export default EmptyReport;
