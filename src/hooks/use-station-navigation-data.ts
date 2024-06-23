'use client';

import { ROUTE_NAMES } from '@/configs/route-name';
import { useParams, usePathname } from 'next/navigation';

const PK_WORK_STATION = 'stationId';

export const useStationNavigationData = () => {
  const params = useParams();
  const pathname = usePathname();
  const isOnStation = pathname?.includes(ROUTE_NAMES.STATIONS);
  const stationId = params?.[PK_WORK_STATION];

  return {
    isOnStation,
    stationId,
  };
};
