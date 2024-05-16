import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_CONVERSATION_SCRIPTS_KEY } from './use-get-conversation-scripts';
import { createOrEditChatScript } from '@/services/scripts.service';
import toast from 'react-hot-toast';

export const useCreateOrEditScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrEditChatScript,
    onSuccess: () => {
      toast.success('Script saved successfully');
      queryClient.invalidateQueries([GET_CONVERSATION_SCRIPTS_KEY]);
    },
    onError: () => {
      toast.error('Failed to save script');
    },
  });
};
