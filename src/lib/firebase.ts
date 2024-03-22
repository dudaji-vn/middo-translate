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
import {
  Messaging,
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
} from 'firebase/messaging';
import addNotification from 'react-push-notification';

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
let messaging: Messaging | null = null;
try {
  messaging = getMessaging();
} catch (error) {
  console.log('An error occurred while retrieving token:', error);
}
const analytics = getAnalytics(app);

export { app as firebaseApp, messaging as firebaseMessaging };

export const requestForToken = async () => {
  try {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    const token = await getToken(messaging, {
      vapidKey: NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY,
    });
    return token;
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
  }
};

export const deleteFCMToken = async () => {
  try {
    if (!messaging) {
      messaging = getMessaging(app);
      await deleteToken(messaging);
    }
    await deleteToken(messaging);
  } catch (error) {
    console.error('An error occurred while deleting token:', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    onMessage(messaging, (payload) => {
      const notifyUrl = payload?.data?.url || '';
      const currentUrl = window.location.href;
      if (notifyUrl && currentUrl.includes(notifyUrl)) {
        return;
      }
      addNotification({
        title: payload?.data?.title || '',
        message: payload?.data?.body || '',
        native: true,
        silent: false,
        onClick: () => {
          window && window.open(notifyUrl, '_self');
        },
      });
      resolve(payload);
    });
  });
