import { useMutation, useQueryClient } from '@tanstack/react-query';

import { roomApi } from '../api';
import { inboxTabMap } from '../components/inbox/inbox';

export const useChangeStatusConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomApi.changeRoomStatus,
    onSuccess: (_, room) => {
      queryClient.invalidateQueries(['rooms', 'pinned']);
      Object.keys(inboxTabMap).forEach((tab) => {
        queryClient.invalidateQueries(['rooms', tab]);
      });
    },
  });
};
