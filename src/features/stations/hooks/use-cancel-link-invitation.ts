import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationApi } from '../api/stations.api';
import { INVITATION_LINK_QUERY_KEY } from './use-get-invitation-link';

export const useCancelLinkInvitation = ({
  stationId,
}: {
  stationId: string;
}) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: () => stationApi.cancelLinkInvitation(stationId),
    onSuccess: () => {
      queryClient.invalidateQueries([INVITATION_LINK_QUERY_KEY, stationId]);
    },
  });

  return { cancel: mutate, ...rest };
};
