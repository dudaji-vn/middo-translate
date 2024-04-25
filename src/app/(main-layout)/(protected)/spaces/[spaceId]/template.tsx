'use client';

import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { useSpaceStore } from '@/stores/space.store';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import BusinessSidebar from './_components/business-sidebar/business-sidebar';

const SpaceTemplate = ({ children }: { children: React.ReactNode }) => {
  const spaceId = useParams()?.spaceId as string;
  const { data } = useGetSpaceData({ spaceId });
  const { setSpace } = useSpaceStore();

  useEffect(() => {
    if (data) {
      setSpace(data);
    }
  }, [data, setSpace]);

  return (
    <div className="flex flex-row">
      <BusinessSidebar />
      {children}
    </div>
  );
};

export default SpaceTemplate;
