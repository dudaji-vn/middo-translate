import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomApi } from '../api';

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomApi.deleteContact,
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries(['rooms', 'contact', undefined]);
      queryClient.invalidateQueries(['rooms', 'waiting', undefined]);
    },
  });
};
