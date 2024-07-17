import MobileDefender from '@/components/non-responsive/mobile-defender';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative w-full overflow-x-hidden overflow-y-auto bg-white dark:bg-background">
      {children}
    </div>
  );
};

export default Layout;
