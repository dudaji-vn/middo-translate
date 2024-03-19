import { useEffect } from 'react';
import { Room } from '../../types';
import { useParams, useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';

type UseInboxRouter = {
  rooms: Room[];
};
export const useInboxRouter = ({ rooms }: UseInboxRouter) => {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    if (!params?.id && rooms.length > 0) {
      router.replace(`${ROUTE_NAMES.ONLINE_CONVERSATION}/${rooms[0]._id}`);
    }
  }, [rooms, params?.id, router]);
};
