import { useQuery } from '@tanstack/react-query';
import { stationApi } from '../api/stations.api';

export const INVITATION_LINK_QUERY_KEY = 'GET_INVITATION_LINK';
export const useGetInvitationLink = ({ stationId }: { stationId: string }) => {
  return useQuery({
    queryKey: [INVITATION_LINK_QUERY_KEY, stationId],
    queryFn: () => stationApi.getInvitationLink(stationId),
  });
};
