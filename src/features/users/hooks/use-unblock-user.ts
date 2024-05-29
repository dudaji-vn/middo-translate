import { unblock } from '@/services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USE_RELATION_KEY } from './use-relationship';
import toast from 'react-hot-toast';

export const useUnBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unblock,
    onSuccess: (_, variables: string) => {
      toast.success('User unblocked');
      queryClient.invalidateQueries([USE_RELATION_KEY, variables]);
    },
  });
};
