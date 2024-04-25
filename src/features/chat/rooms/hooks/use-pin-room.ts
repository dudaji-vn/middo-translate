import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roomApi } from '../api';
import { inboxTabMap } from '../components/inbox/inbox';

export const usePinRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomApi.pin,
    onSuccess: () => {
      queryClient.invalidateQueries(['rooms', 'pinned']);
      Object.keys(inboxTabMap).forEach((tab) => {
        queryClient.invalidateQueries(['rooms', tab]);
      });
    },
  });
};

export const USE_GET_PINNED_ROOMS_KEY = ['rooms', 'pinned'];
export const useGetPinnedRooms = (spaceId?: string) => {
  const { data, ...rest } = useQuery(USE_GET_PINNED_ROOMS_KEY, () =>
    roomApi.getPinned(spaceId),
  );
  return { rooms: data, ...rest };
};
