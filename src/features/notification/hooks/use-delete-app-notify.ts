import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appNotifyApi } from '../api/app-notify.api';
import { GET_APP_NOTIFY_KEY } from './use-get-app-notify';

export const useDeleteAppNotify = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appNotifyApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries([GET_APP_NOTIFY_KEY]);
    },
  });
};
