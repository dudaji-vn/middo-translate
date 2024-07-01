import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationApi } from '../api/stations.api';
import { GET_STATION_DATA_KEY } from './use-get-station';
import customToast from '@/utils/custom-toast';

export const useInviteMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stationApi.inviteMembersByUserId,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        GET_STATION_DATA_KEY,
        { stationId: variables.stationId },
      ]);
    },
    onError: (error: any) => {
      customToast.error(error.response?.data?.message || error.message);
    },
  });
};
