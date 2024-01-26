import { useQuery } from '@tanstack/react-query';
import { messageApi } from '../../messages/api';
export const PIN_MESSAGE_KEY = 'pinned';
export const useGetPinnedMessages = ({ roomId }: { roomId?: string }) => {
  console.log('key', [PIN_MESSAGE_KEY, roomId]);
  return useQuery({
    queryKey: [PIN_MESSAGE_KEY, roomId],
    queryFn: () => messageApi.getPinned(roomId!),
    enabled: !!roomId,
  });
};
