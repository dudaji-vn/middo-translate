import { deleteChatScripts } from '@/services/scripts.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_CONVERSATION_SCRIPTS_KEY } from './use-get-conversation-scripts';

export const useDeleteScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChatScripts,
    onSuccess: () => {
      queryClient.invalidateQueries([GET_CONVERSATION_SCRIPTS_KEY]);
    },
  });
};
