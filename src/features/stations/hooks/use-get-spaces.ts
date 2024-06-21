'use client';

import { StationTabType } from '@/app/(main-layout)/(protected)/stations/_components/type';
import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const GET_STATIONS_KEY = 'get-stations';

export const useGetStations = ({ type }: { type?: StationTabType }) => {
  return useQuery({
    queryKey: [GET_STATIONS_KEY, { type }],
    queryFn: async () => {
      try {
        const response = await axios.get(`/stations`, {
          params: {
            type,
          },
        });
        console.log('STATION:: ', response.data);
        return response.data;
      } catch (error) {
        console.error(`Error fetching stations: ${error as Error}`);
        return {};
      }
    },
    enabled: true,
  });
};
