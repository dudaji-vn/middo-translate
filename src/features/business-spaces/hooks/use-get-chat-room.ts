'use client';

import { NEXT_PUBLIC_API_URL } from '@/configs/env.public';
import { useQuery } from '@tanstack/react-query';

export const GET_ROOM_DATA_KEY = 'get-room-data';

export const useGetRoomData = ({
  roomId,
  userId = '',
}: {
  roomId: string;
  userId?: string;
}) => {
  return useQuery({
    queryKey: [GET_ROOM_DATA_KEY, { roomId }],
    queryFn: async () => {
      if (!roomId) {
        return {};
      }
      try {
        const response = await fetch(
          `${NEXT_PUBLIC_API_URL}/api/rooms/anonymous/${roomId}?userId=${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(
          `Error fetching room ${roomId}: ${(error as Error).message}`,
        );
        return {};
      }
    },
    enabled: true,
  });
};
