import { useMutation } from '@tanstack/react-query';
import { messageApi } from '../api';

export const useMarkAllChildAsRead = () => {
  return useMutation({
    mutationFn: messageApi.markAsReadAllChild,
  });
};
