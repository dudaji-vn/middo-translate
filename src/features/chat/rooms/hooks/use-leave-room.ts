import { ROUTE_NAMES } from '@/configs/route-name';
import { redirect } from 'next/navigation';
import { roomApi } from '../api';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

export const useLeaveRoom = () => {
  return useMutation({
    mutationFn: roomApi.leaveRoom,
    onSuccess: () => {
      toast.success('Left room successfully');
      redirect(ROUTE_NAMES.ONLINE_CONVERSATION);
    },
  });
};
