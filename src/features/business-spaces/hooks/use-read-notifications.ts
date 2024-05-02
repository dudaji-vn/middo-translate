import { TSpacesNotification } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/business-notifications/spaces-notifications';
import { axios } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useReadNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notifications: TSpacesNotification[]) => {
      const notificationIds = notifications.map((item) => item._id);
      await Promise.all(
        notificationIds.map((notificationId) =>
          axios.patch(`/help-desk/notifications/read/${notificationId}`),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['get-my-business-notifications']);
      //   router.refresh();
    },
  });
};
