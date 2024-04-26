import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" container-height w-full overflow-hidden bg-primary-100">
      {children}
    </div>
  );
};

export default Layout;
