import { useEffect } from 'react';
import { Room } from '../../types';
import { useParams, useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useBusiness } from '@/hooks/use-business';

type UseInboxRouter = {
  rooms: Room[];
};
export const useInboxRouter = ({ rooms }: UseInboxRouter) => {
  const router = useRouter();
  const params = useParams();
  const { isBusiness } = useBusiness();
  useEffect(() => {
    if (!params?.id && rooms.length > 0 && !isBusiness) {
      router.push(`${ROUTE_NAMES.ONLINE_CONVERSATION}/${rooms[0]._id}`);
    }
  }, [rooms, params?.id, router]);
};
