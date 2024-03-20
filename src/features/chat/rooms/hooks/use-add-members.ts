import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { useChatBox } from '../contexts';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useAddMembers = () => {
  const { updateRoom } = useChatBox();
  const {t} = useTranslation('common');
  return useMutation({
    mutationFn: roomApi.addMembers,
    onSuccess: (data) => {
      toast.success(t('MESSAGE.SUCCESS.ROOM_INFO_UPDATED'));
      updateRoom({
        participants: data.participants,
      });
    },
  });
};
