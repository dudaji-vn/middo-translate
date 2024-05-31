import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useAccept = () => {
  const { t } = useTranslation('common');
  const { mutate: accept, ...rest } = useMutation({
    mutationFn: roomApi.accept,
    onSuccess: (data) => {
      // toast.success(t());
      toast.success('You joined the room successfully');
    },
  });
  return {
    accept,
    ...rest,
  };
};
