'use client';

import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { useSpaceStore } from '@/stores/space.store';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const SpaceTemplate = ({ children }: { children: React.ReactNode }) => {
  const spaceId = useParams()?.spaceId as string;
  const { data } = useGetSpaceData({ spaceId });
  const { setSpace } = useSpaceStore();

  useEffect(() => {
    if (data) {
      setSpace(data);
    }
  }, [data, setSpace]);

  return children;
};

export default SpaceTemplate;
