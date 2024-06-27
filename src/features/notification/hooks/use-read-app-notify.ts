import { TSpacesNotification } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/business-notifications/spaces-notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appNotifyApi } from '../api/app-notify.api';
import { GET_APP_NOTIFY_KEY } from './use-get-app-notify';

export const useReadAppNotify = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notifications: TSpacesNotification[]) => {
      const notificationIds = notifications.map((item) => item._id);
      await Promise.all(
        notificationIds.map((notificationId) =>
          appNotifyApi.read(notificationId),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries([GET_APP_NOTIFY_KEY]);
      //   router.refresh();
    },
  });
};
