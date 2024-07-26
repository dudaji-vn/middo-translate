import { useQuery } from '@tanstack/react-query';
import { roomApi } from '../api';

const USE_COUNT_WAITING_ROOMS_QUERY_KEY = 'waitingRooms';
export const useCountWaitingRooms = () => {
  return useQuery({
    queryKey: [USE_COUNT_WAITING_ROOMS_QUERY_KEY],
    queryFn: roomApi.countWaitingRooms,
  });
};
