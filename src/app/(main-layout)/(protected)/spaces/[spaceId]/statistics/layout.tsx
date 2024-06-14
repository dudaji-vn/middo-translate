import React from 'react';

const StatisticLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <main className="container-height  flex w-full  flex-col  overflow-y-auto overflow-x-hidden  py-3">
      {children}
    </main>
  );
};

export default StatisticLayout;
