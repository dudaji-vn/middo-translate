import React, { ReactNode } from 'react';

const LayoutHelpDesk = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container-height  mx-auto flex w-full shadow-md md:max-w-7xl">
      {children}
    </div>
  );
};

export default LayoutHelpDesk;
