import {
  NEXT_PUBLIC_PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_KEY,
} from '@/configs/env.public';
import { PUSHER_APP_ID, PUSHER_SECRET } from '@/configs/env.private';

import PusherClient from 'pusher-js';
import PusherServer from 'pusher';

export const pusherClient = new PusherClient('7e4a4fbde16ab3fbffb7', {
  cluster: 'ap1',
});

export const pusherServer = new PusherServer({
  appId: '1708592',
  key: '7e4a4fbde16ab3fbffb7',
  secret: 'f9ec0bb4d377e18b5012',
  cluster: 'ap1',
  useTLS: true,
});
