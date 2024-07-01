import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roomApi } from '../api';
import { inboxTabMap } from '../components/inbox/inbox';
import { useParams } from 'next/navigation';
import { PK_SPACE_KEY } from '@/types/business.type';
import { PK_STATION_KEY } from '@/app/(main-layout)/(protected)/stations/_components/type';

export const usePinRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomApi.pin,
    onSuccess: () => {
      queryClient.invalidateQueries(['rooms', 'pinned']);
      Object.keys(inboxTabMap).forEach((tab) => {
        queryClient.invalidateQueries(['rooms', tab]);
      });
    },
  });
};

export const USE_GET_PINNED_ROOMS_KEY = ['rooms', 'pinned'];
export const useGetPinnedRooms = () => {
  const params = useParams();
  const spaceId = params?.[PK_SPACE_KEY] ? String(params?.spaceId) : undefined;
  const stationId = params?.[PK_STATION_KEY]
    ? String(params?.stationId)
    : undefined;

  const { data, ...rest } = useQuery(USE_GET_PINNED_ROOMS_KEY, () =>
    roomApi.getPinned({
      spaceId,
      stationId,
    }),
  );
  return { rooms: data, ...rest };
};
