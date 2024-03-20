import { recommendationApi } from '../api';
import { useQuery } from '@tanstack/react-query';

export const useGetUsersRecChat = () => {
  return useQuery({
    queryKey: ['users-rec-chat'],
    queryFn: recommendationApi.users,
  });
};

export const useGetRoomsRecChat = (type?: string) => {
  return useQuery({
    queryKey: ['rooms-rec-chat'],
    queryFn: () => recommendationApi.rooms(type),
  });
};
