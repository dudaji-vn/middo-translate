import { useMutation } from '@tanstack/react-query';
import { messageApi } from '../api';

export const useReactMessage = () => {
  return useMutation({
    mutationFn: messageApi.react,
  });
};
