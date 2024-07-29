'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import CreateOrEditBusinessForm from './_components/form-creation/create-form';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const modal = searchParams?.get('modal');

  return (
    <div className=" container-height relative w-full overflow-hidden  dark:bg-background">
      {modal === 'create' ? (
        <div className="background-business-forms flex h-screen  flex-col overflow-hidden ">
          <CreateOrEditBusinessForm open />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Layout;
