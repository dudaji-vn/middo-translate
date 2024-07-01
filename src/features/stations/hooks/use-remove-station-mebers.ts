'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationApi } from '../api/stations.api';
import { GET_STATION_DATA_KEY } from './use-get-station';

export const useRemoveStationMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stationApi.removeMember,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries([
        GET_STATION_DATA_KEY,
        { stationId: variables.stationId },
      ]);
    },
  });
};
