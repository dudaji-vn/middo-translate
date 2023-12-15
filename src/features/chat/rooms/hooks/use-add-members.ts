import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { useChatBox } from '../contexts';
import { useMutation } from '@tanstack/react-query';

export const useAddMembers = () => {
  const { updateRoom } = useChatBox();
  return useMutation({
    mutationFn: roomApi.addMembers,
    onSuccess: (data) => {
      toast.success('Room info updated');
      updateRoom({
        participants: data.participants,
      });
    },
  });
};
