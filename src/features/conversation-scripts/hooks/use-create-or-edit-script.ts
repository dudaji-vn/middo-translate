import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_CONVERSATION_SCRIPTS_KEY } from './use-get-conversation-scripts';
import { createOrEditChatScript } from '@/services/scripts.service';
import customToast from '@/utils/custom-toast';

export const useCreateOrEditScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrEditChatScript,
    onSuccess: () => {
      customToast.success('Script saved successfully');
      queryClient.invalidateQueries([GET_CONVERSATION_SCRIPTS_KEY]);
    },
    onError: () => {
      customToast.error('Failed to save script');
    },
  });
};
