import { Typography } from '@/components/data-display';
import React from 'react';
import ChartFilterDropdown from './_components/report/report-chart/chart-filter-dropdown';

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
        <Typography className=" flex flex-row items-center justify-between space-y-0  font-medium text-primary-500-main">
          <ChartFilterDropdown />
        </Typography>
        {report}
      </section>
    </main>
  );
};

export default StatisticLayout;
