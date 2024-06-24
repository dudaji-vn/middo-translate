'use client';

import { PageLoading } from '@/components/feedback';
import { useGetStation } from '@/features/stations/hooks/use-get-space-data';
import { useAuthStore } from '@/stores/auth.store';
import { notFound } from 'next/navigation';
import React, { useEffect } from 'react';

const StationLayout = ({
  children,
  params: { stationId },
}: {
  children: React.ReactNode;
  params: {
    stationId: string;
  };
}) => {
  const { setWorkStation, workStation } = useAuthStore();
  const { data, isLoading, isFetched } = useGetStation({ stationId });
  console.log('stationId ::>', stationId);

  useEffect(() => {
    if (data) {
      console.log('station Data ::>', data);
      setWorkStation(data);
    }
  }, [data, setWorkStation]);
  if (!data && isFetched && !isLoading) {
    notFound();
  }
  if (isLoading) return <PageLoading />;
  return <>{children}</>;
};

export default StationLayout;
