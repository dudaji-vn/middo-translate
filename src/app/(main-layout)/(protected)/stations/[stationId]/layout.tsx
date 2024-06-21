import { getStationById } from '@/features/stations/services/station.service';
import { notFound } from 'next/navigation';
import React from 'react';

const layout = async ({
  children,
  params: { stationId },
}: {
  children: React.ReactNode;
  params: {
    stationId: string;
  };
}) => {
  const stationData = await getStationById(stationId);
  console.log(stationData);
  if (!stationData) {
    notFound();
  }
  return children;
};

export default layout;
