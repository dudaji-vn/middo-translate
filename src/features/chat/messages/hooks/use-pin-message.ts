import { useMutation, useQuery } from '@tanstack/react-query';
import { messageApi } from '../api';
import { PIN_MESSAGE_KEY } from '../../rooms/hooks/use-get-pin-message';

export const usePinMessage = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: messageApi.pin,
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
