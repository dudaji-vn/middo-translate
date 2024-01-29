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
import { deleteToken, getMessaging, getToken } from 'firebase/messaging';

import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: NEXT_PUBLIC_FCM_API_KEY,
  authDomain: NEXT_PUBLIC_FCM_AUTH_DOMAIN,
  projectId: NEXT_PUBLIC_FCM_PROJECT_ID,
  storageBucket: NEXT_PUBLIC_FCM_STORAGE_BUCKET,
  messagingSenderId: NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_FCM_APP_ID,
  measurementId: NEXT_PUBLIC_FCM_MEASUREMENT_ID,
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
  return token;
};

export const deleteFCMToken = async () => {
  console.log('deleteFCMToken');
  await deleteToken(messaging);
};
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       console.log('payload', payload);
//       resolve(payload);
//     });
//   });
