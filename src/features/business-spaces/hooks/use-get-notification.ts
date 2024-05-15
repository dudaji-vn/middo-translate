'use client';

import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const GET_NOTI_KEY = 'get-my-business-notifications';

export const useGetMyBusinessNotifications = () => {
  return useQuery({
    queryKey: [GET_NOTI_KEY],
    queryFn: async () => {
      try {
        const response = await axios.get(`/help-desk/notifications`);
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching business notifications: ${(error as Error).message}`,
        );
        return [];
      }
    },
    enabled: true,
  });
};
