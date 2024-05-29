import { Typography } from '@/components/data-display';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyReport = () => {
  const { t } = useTranslation('common');
  return (
    <section className="flex h-full w-full flex-col justify-between ">
      <div className="w-full flex-none px-4 md:px-10">
        <Typography className=" flex flex-row items-center justify-between text-base font-semibold text-neutral-800">
          {t('EXTENSION.REPORT')}
        </Typography>
      </div>
      <div className="m-auto flex flex-grow flex-col justify-center space-y-4">
        <Image
          src="/empty_report.svg"
          width={10}
          height={10}
          alt="Empty-report"
          className="h-auto w-[500px] max-w-full"
        />
        <Typography className="flex w-full items-center justify-center text-neutral-800">
          Empty data at this time
        </Typography>
      </div>
    </section>
  );
};

export default EmptyReport;
