import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { useChatBox } from '../contexts';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';

export const useUpdateRoomInfo = () => {
  const { updateRoom } = useChatBox();
  const {t} = useTranslation('common');
  return useMutation({
    mutationFn: roomApi.updateRoom,
    onSuccess: (data) => {
      customToast.success(t('MESSAGE.SUCCESS.ROOM_INFO_UPDATED'));
      updateRoom(data);
    },
  });
};
