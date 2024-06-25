import { useParams } from 'next/navigation';
import { recommendationApi } from '../api';
import { useQuery } from '@tanstack/react-query';
import { PK_STATION_KEY } from '@/app/(main-layout)/(protected)/stations/_components/type';

export const useGetUsersRecChat = () => {
  return useQuery({
    queryKey: ['users-rec-chat'],
    queryFn: recommendationApi.globalUsers,
  });
};



export const useGetRoomsRecChat = (businessSpaceParams?: {
  type?: string;
  spaceId?: string;
}) => {
  const params = useParams();
  const stationId = params?.[PK_STATION_KEY]
    ? String(params[PK_STATION_KEY])
    : undefined;
  return useQuery({
    queryKey: [
      'rooms-rec-chat',
      businessSpaceParams?.spaceId,
      businessSpaceParams?.type,
    ],
    queryFn: () => {
      if (stationId) {
        return recommendationApi.stationRooms(stationId);
      }
      if (businessSpaceParams) {
        return recommendationApi.spaceRooms(businessSpaceParams);
      }
      recommendationApi.globalRooms();
    },
  });
};
