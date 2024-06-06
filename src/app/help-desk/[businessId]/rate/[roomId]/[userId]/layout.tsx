import React, { ReactNode } from 'react';

const LayoutHelpDesk = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" mx-auto flex  !h-[87%] w-full rounded-b-xl bg-white shadow-md md:max-w-7xl">
      {children}
    </div>
  );
};

export default LayoutHelpDesk;
