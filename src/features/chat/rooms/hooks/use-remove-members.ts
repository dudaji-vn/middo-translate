import { roomApi } from '../api';
import { useChatBox } from '../contexts';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';

export const useRemoveMember = () => {
  const { updateRoom } = useChatBox();
  const { t } = useTranslation('common');
  return useMutation({
    mutationFn: roomApi.removeMember,
    onSuccess: (data) => {
      customToast.success(t('MESSAGE.SUCCESS.ROOM_INFO_UPDATED'));
      updateRoom({
        participants: data.participants,
      });
    },
  });
};
