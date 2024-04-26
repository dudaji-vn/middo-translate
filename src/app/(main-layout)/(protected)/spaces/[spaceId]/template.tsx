'use client';

import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import BusinessSidebar from './_components/business-sidebar/business-sidebar';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';

const SpaceTemplate = ({ children }: { children: React.ReactNode }) => {
  const spaceId = useParams()?.spaceId as string;
  const { data, isLoading } = useGetSpaceData({ spaceId });
  const { setSpace } = useAuthStore();

  useEffect(() => {
    if (data) {
      setSpace(data);
    }
  }, [data, setSpace]);

  return (
    <div className="flex flex-row">
      <div
        className={cn('w-[74px] max-md:hidden', {
          invisible: isLoading || !data,
        })}
      >
        <BusinessSidebar space={data} />
      </div>
      {children}
    </div>
  );
};

export default SpaceTemplate;
