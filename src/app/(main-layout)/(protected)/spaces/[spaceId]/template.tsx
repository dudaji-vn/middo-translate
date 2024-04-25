'use client';

import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { useSpaceStore } from '@/stores/space.store';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import BusinessSidebar from './_components/business-sidebar/business-sidebar';
import { cn } from '@/utils/cn';

const SpaceTemplate = ({ children }: { children: React.ReactNode }) => {
  const spaceId = useParams()?.spaceId as string;
  const { data, isLoading } = useGetSpaceData({ spaceId });
  const { setSpace } = useSpaceStore();

  useEffect(() => {
    if (data) {
      setSpace(data);
    }
  }, [data, setSpace]);

  return (
    <div className="flex flex-row">
      <div
        className={cn('w-[74px] max-md:hidden', {
          hidden: isLoading || !data,
        })}
      >
        <BusinessSidebar space={data} />
      </div>
      {children}
    </div>
  );
};

export default SpaceTemplate;
