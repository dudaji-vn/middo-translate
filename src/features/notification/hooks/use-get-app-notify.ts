'use client';

import { useQuery } from '@tanstack/react-query';
import { appNotifyApi } from '../api/app-notify.api';

export const GET_APP_NOTIFY_KEY = 'get-app-notifications';

export const useGetAppNotify = () => {
  return useQuery({
    queryKey: [GET_APP_NOTIFY_KEY],
    queryFn: appNotifyApi.getAll,
    enabled: true,
  });
};
