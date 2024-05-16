import { deleteChatScript } from '@/services/scripts.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChatScript,
    onSuccess: () => {
      queryClient.invalidateQueries(['get-my-business-notifications']);
    },
  });
};
