import { useQuery } from '@tanstack/react-query';
import { messageApi } from '../api';
export const USE_COUNT_UNREAD_CHILD_KEY = 'countUnreadChild';
export const useCountUnreadChild = (id: string) => {
  return useQuery({
    queryKey: [USE_COUNT_UNREAD_CHILD_KEY, id],
    queryFn: () => messageApi.countUnreadChild(id),
  });
};
