import React from 'react';
import { ReportHeader } from './_components/report/report-header';

const StatisticLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <main className="extension-container-height  flex w-full  flex-col  overflow-y-auto overflow-x-hidden  py-3">
      <section className="relative w-full space-y-4 px-4 md:px-10">
        <ReportHeader />
      </section>
      {children}
    </main>
  );
};

export default StatisticLayout;
