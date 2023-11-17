import {
  NEXT_PUBLIC_PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_KEY,
} from '@/configs/env.public';
import { PUSHER_APP_ID, PUSHER_SECRET } from '@/configs/env.private';

import PusherServer from 'pusher';

export const pusherServer = new PusherServer({
  appId: PUSHER_APP_ID,
  key: NEXT_PUBLIC_PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});
