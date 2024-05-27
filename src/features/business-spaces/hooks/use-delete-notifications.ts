import { TSpacesNotification } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/business-notifications/spaces-notifications';
import { axios } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_NOTI_KEY } from './use-get-notification';

export const useDeleteNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`/help-desk/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([GET_NOTI_KEY]);
    },
  });
};
