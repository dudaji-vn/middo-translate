import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '../api';

export const usePinMessage = () => {
  // const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: messageApi.pin,
    onSuccess: () => {
      // queryClient.invalidateQueries(['rooms', 'pinned']);
      // queryClient.invalidateQueries(['rooms', 'all' as InboxType]);
      // queryClient.invalidateQueries(['rooms', 'group' as InboxType]);
    },
  });
  return { pin: mutate, ...rest };
};

export const USE_GET_PINNED_ROOMS_KEY = ['rooms', 'pinned'];
export const useGetPinnedMessages = () => {
  const { data, ...rest } = useQuery(
    USE_GET_PINNED_ROOMS_KEY,
    // messageApi.getPinned,
  );
  return { rooms: data, ...rest };
};
