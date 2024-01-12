import { notificationApi } from '@/features/notification/api';
import { useQuery } from '@tanstack/react-query';
export const USE_IS_MUTED_ROOM_QUERY_KEY = 'room-notification';
export const useIsMutedRoom = (roomId: string) => {
  const { data } = useQuery(
    [USE_IS_MUTED_ROOM_QUERY_KEY, roomId],
    () => notificationApi.checkIsRoomMuted(roomId),
    {
      enabled: !!roomId,
      staleTime: Infinity,
    },
  );

  return { isMuted: data?.isMuted };
};
