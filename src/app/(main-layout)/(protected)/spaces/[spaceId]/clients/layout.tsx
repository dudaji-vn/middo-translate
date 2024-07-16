'use client';

import { useAppStore } from '@/stores/app.store';
import React from 'react';
import SpaceNavigator from '../_components/space-navigator/space-navigator';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useAppStore();
  return (
    <div className="container-height  relative w-full overflow-hidden bg-white dark:bg-background">
      {isMobile && <SpaceNavigator />}
      {children}
    </div>
  );
};

export default Layout;
