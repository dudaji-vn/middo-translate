import { anonymousMessagesAPI } from '../../help-desk/api/anonymous-message.service';
import { messageApi } from '../../messages/api';
import { useQuery } from '@tanstack/react-query';
export const PIN_MESSAGE_KEY = 'pinned';
export const useGetPinnedMessages = ({
  roomId,
  isAnonymous,
}: {
  roomId?: string;
  isAnonymous?: boolean;
}) => {
  return useQuery({
    queryKey: [PIN_MESSAGE_KEY, roomId],
    queryFn: () =>
      isAnonymous
        ? anonymousMessagesAPI.getPinned(roomId!)
        : messageApi.getPinned(roomId!),
    enabled: !!roomId,
  });
};
