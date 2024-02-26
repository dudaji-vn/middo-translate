import { messageApi } from '../../messages/api';
import { useQuery } from '@tanstack/react-query';
export const PIN_MESSAGE_KEY = 'pinned';
export const useGetPinnedMessages = ({ roomId }: { roomId?: string }) => {
  return useQuery({
    queryKey: [PIN_MESSAGE_KEY, roomId],
    queryFn: () => messageApi.getPinned(roomId!),
    enabled: !!roomId,
  });
};
