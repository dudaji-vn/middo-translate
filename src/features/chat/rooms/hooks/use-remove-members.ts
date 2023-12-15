import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { useChatBox } from '../contexts';
import { useMutation } from '@tanstack/react-query';

export const useRemoveMember = () => {
  const { updateRoom } = useChatBox();
  return useMutation({
    mutationFn: roomApi.removeMember,
    onSuccess: (data) => {
      toast.success('Room info updated');
      updateRoom({
        participants: data.participants,
      });
    },
  });
};
