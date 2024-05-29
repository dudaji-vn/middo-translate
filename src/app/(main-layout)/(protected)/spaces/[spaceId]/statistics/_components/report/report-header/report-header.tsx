'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/data-display';
import ReportPickerDomain from './report-picker-domain';
import ReportPickerMember from './report-picker-member';
import ReportPickerTime from './report-picker-time';

export type ReportHeaderProps = {};

const ReportHeader = ({ ...props }: ReportHeaderProps) => {
  const { t } = useTranslation('common');

  return (
    <section className="relative w-full space-y-4 px-4 md:px-10">
      <Typography className=" flex flex-row items-center justify-between  space-y-0 text-base font-semibold text-neutral-800">
        {t('BUSINESS.REPORT')}
      </Typography>
      <div className="flex w-full flex-col justify-between gap-2 pb-4 md:flex-row">
        <ReportPickerDomain />
        <ReportPickerMember />
        <ReportPickerTime />
      </div>
    </section>
  );
};

export default ReportHeader;
