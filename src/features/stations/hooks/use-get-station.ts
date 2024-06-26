'use client';

import { useQuery } from '@tanstack/react-query';
import { stationApi } from '../api/stations.api';

export const GET_STATION_DATA_KEY = 'get-station-data';

export const useGetStation = ({ stationId }: { stationId: string }) => {
  return useQuery({
    queryKey: [GET_STATION_DATA_KEY, { stationId }],
    queryFn: () => stationApi.getStationById(stationId),
    enabled: !!stationId,
  });
};
