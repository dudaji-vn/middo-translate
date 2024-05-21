import { Typography } from '@/components/data-display';
import React from 'react';
import ReportHeader from './_components/report/report-header/report-header';

const StatisticLayout = ({
  report,
  children,
}: {
  report: JSX.Element;
  children: JSX.Element;
}) => {
  return (
    <main className="container-height flex w-full flex-col gap-10  overflow-hidden  overflow-x-hidden p-4">
      {children}
      <section className="relative w-full space-y-4">
        <ReportHeader />
      </section>
      {report}
    </main>
  );
};

export default StatisticLayout;
