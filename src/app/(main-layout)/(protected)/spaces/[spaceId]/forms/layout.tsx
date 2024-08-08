'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import CreateOrEditBusinessForm from './_components/form-creation/create-form';
import { useAppStore } from '@/stores/app.store';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const modal = searchParams?.get('modal');

  if (modal === 'create') {
    return (
      <div className=" container-height relative w-full overflow-hidden  dark:bg-background">
        <div className=" flex h-screen  flex-col overflow-hidden ">
          <CreateOrEditBusinessForm open />
        </div>
      </div>
    );
  }
  return (
    <div className=" container-height relative w-full overflow-hidden  dark:bg-background">
      {children}
    </div>
  );
};

export default Layout;
