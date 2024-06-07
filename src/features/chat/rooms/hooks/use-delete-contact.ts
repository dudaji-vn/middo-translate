import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomApi } from '../api';
import { inboxTabMap } from '../components/inbox/inbox';

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomApi.deleteContact,
    onSuccess: (_, roomId) => {
      Object.keys(inboxTabMap).forEach((tab) => {
        queryClient.invalidateQueries(['rooms', tab]);
      });
    },
  });
};
