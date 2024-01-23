import { useQuery } from '@tanstack/react-query';
import { messageApi } from '../../messages/api';

export const useGetPinMessage = ({ roomId }: { roomId?: string }) => {
  return useQuery({
    queryKey: ['pinned', roomId],
    queryFn: () => messageApi.getPinned(roomId!),
    enabled: !!roomId,
  });
};
