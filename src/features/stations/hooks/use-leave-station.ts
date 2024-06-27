import { ROUTE_NAMES } from '@/configs/route-name';
import { redirect } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';
import { stationApi } from '../api/stations.api';

export const useLeaveStation = () => {
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: stationApi.leaveStation,
    onSuccess: () => {
      customToast.success(t('MESSAGE.SUCCESS.LEAVE_ROOM'));
      redirect(ROUTE_NAMES.STATIONS);
    },
  });
};
