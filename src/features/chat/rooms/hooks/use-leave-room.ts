import { ROUTE_NAMES } from '@/configs/route-name';
import { redirect } from 'next/navigation';
import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';

export const useLeaveRoom = () => {
  const {t} = useTranslation('common')
  return useMutation({
    mutationFn: roomApi.leaveRoom,
    onSuccess: () => {
      customToast.success(t('MESSAGE.SUCCESS.LEAVE_ROOM'));
      redirect(ROUTE_NAMES.ONLINE_CONVERSATION);
    },
  });
};
