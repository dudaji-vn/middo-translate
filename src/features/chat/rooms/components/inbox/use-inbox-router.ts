import { useEffect } from 'react';
import { Room } from '../../types';
import { useParams, useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useAppStore } from '@/stores/app.store';

type UseInboxRouter = {
  rooms: Room[];
};
export const useInboxRouter = ({ rooms }: UseInboxRouter) => {
  const router = useRouter();
  const isMobile = useAppStore((state) => state.isMobile);
  const params = useParams();
  const { isBusiness } = useBusinessNavigationData();
  useEffect(() => {
    if (!params?.id && rooms.length > 0 && !isBusiness && !isMobile) {
      router.push(`${ROUTE_NAMES.ONLINE_CONVERSATION}/${rooms[0]._id}`);
    }
  }, [rooms, params?.id, router, isBusiness, isMobile]);
};
