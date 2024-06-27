import { useQuery } from '@tanstack/react-query';
import { stationApi } from '../api/stations.api';

export const INVITATION_LINK_QUERY_KEY = 'invitation-link';
export const useCheckIsActiveLinkInvitation = ({
  stationId,
}: {
  stationId: string;
}) => {
  const { data } = useQuery({
    queryKey: [INVITATION_LINK_QUERY_KEY, stationId],
    queryFn: () => stationApi.checkIsActiveLinkInvitation(stationId),
  });
  return { isActive: data || false };
};
