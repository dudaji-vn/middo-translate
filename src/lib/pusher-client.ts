import {
  NEXT_PUBLIC_PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_KEY,
} from '@/configs/env.public';

import PusherClient from 'pusher-js';

export const pusherClient = new PusherClient(NEXT_PUBLIC_PUSHER_KEY, {
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
});
