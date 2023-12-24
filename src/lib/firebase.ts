import {
  NEXT_PUBLIC_FCM_API_KEY,
  NEXT_PUBLIC_FCM_APP_ID,
  NEXT_PUBLIC_FCM_AUTH_DOMAIN,
  NEXT_PUBLIC_FCM_MEASUREMENT_ID,
  NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FCM_PROJECT_ID,
  NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY,
  NEXT_PUBLIC_FCM_STORAGE_BUCKET,
} from '@/configs/env.public';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCUn5KV-z1PTBMxwyVbtZLTRr4G9GdrMHs',
  authDomain: 'middo-translate.firebaseapp.com',
  projectId: 'middo-translate',
  storageBucket: 'middo-translate.appspot.com',
  messagingSenderId: '835558552712',
  appId: '1:835558552712:web:0523aadb556b9c26e41b3d',
  measurementId: 'G-2VL4NDQZRQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging();
const analytics = getAnalytics(app);

export { app as firebaseApp, messaging as firebaseMessaging };

export const requestForToken = async () => {
  const token = await getToken(messaging, {
    vapidKey: NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY,
  });
  console.log('token', token);
  return token;
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('payload', payload);
      resolve(payload);
    });
  });
