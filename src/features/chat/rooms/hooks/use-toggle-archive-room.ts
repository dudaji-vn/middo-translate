import { useMutation } from '@tanstack/react-query';
import { roomApi } from '../api';

export const useToggleArchiveRoom = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: roomApi.toggleArchive,
    // onSuccess: () => {
    //   Object.keys(inboxTabMap).forEach((tab) => {
    //     queryClient.invalidateQueries(['rooms', tab]);
    //   });
    // },
  });
  return {
    toggleArchive: mutate,
    ...rest,
  };
};
