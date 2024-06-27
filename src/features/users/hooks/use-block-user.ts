import { block } from '@/services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USE_RELATION_KEY } from './use-relationship';
import toast from 'react-hot-toast';
import customToast from '@/utils/custom-toast';

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: block,
    onSuccess: (_, variables: string) => {
      customToast.success('User blocked');
      queryClient.invalidateQueries([USE_RELATION_KEY, variables]);
    },
  });
};
