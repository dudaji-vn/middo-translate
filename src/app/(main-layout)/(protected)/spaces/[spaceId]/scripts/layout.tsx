import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container-height w-full overflow-hidden bg-white dark:bg-background">
      {children}
    </div>
  );
};

export default Layout;
