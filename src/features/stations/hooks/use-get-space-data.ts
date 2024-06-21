'use client';

import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const GET_STATION_DATA_KEY = 'get-station-data';

export const useGetStation = ({ stationId }: { stationId: string }) => {
  return useQuery({
    queryKey: [GET_STATION_DATA_KEY, { stationId }],
    queryFn: async () => {
      try {
        const response = await axios.get(`/stations/${stationId}`, {
          params: {
            stationId,
          },
        });
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching station "${stationId}" : ${error as Error}`,
        );
        return {};
      }
    },
    enabled: true,
  });
};
