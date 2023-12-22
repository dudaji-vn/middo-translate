import { recommendationApi } from '../api';
import { useQuery } from '@tanstack/react-query';

export const useGetUsersRecChat = () => {
  return useQuery({
    queryKey: ['users-rec-chat'],
    queryFn: recommendationApi.chat,
  });
};
