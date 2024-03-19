import { useEffect } from 'react';
import { Room } from '../../types';
import { useParams, useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

type UseInboxRouter = {
  rooms: Room[];
};
export const useInboxRouter = ({ rooms }: UseInboxRouter) => {
  const router = useRouter();
  const params = useParams();
  const { isBusiness } = useBusinessNavigationData();
  useEffect(() => {
    if (!params?.id && rooms.length > 0 && !isBusiness) {
      router.push(`${ROUTE_NAMES.ONLINE_CONVERSATION}/${rooms[0]._id}`);
    }
  }, [rooms, params?.id, router]);
};
