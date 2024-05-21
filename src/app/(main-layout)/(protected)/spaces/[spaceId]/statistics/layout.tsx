import React from 'react';
import ReportHeader from './_components/report/report-header/report-header';

const StatisticLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <main className="container-height flex w-full  flex-col gap-10 overflow-hidden overflow-x-hidden  p-4  px-10 py-3">
      <section className="relative w-full space-y-4">
        <ReportHeader />
      </section>
      {children}
    </main>
  );
};

export default StatisticLayout;
