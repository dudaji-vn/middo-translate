import { useMutation, useQueryClient } from '@tanstack/react-query';

import { roomApi } from '../api';

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomApi.deleteAllMessages,
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries(['messages', roomId]);
    },
  });
};
