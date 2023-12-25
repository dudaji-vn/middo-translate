'use client';

import { getMessaging, getToken } from 'firebase/messaging';
import { useEffect, useState } from 'react';

import { NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY } from '@/configs/env.public';
import { firebaseApp } from '@/lib/firebase';

export interface FCMProviderProps {}

export const FCMProvider = (props: FCMProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );

  const retrieveToken = async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const messaging = getMessaging(firebaseApp);
        // Retrieve the notification permission status
        const permission = await Notification.requestPermission();
        setPermission(permission);
        // Check if permission is granted before retrieving the token
        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY,
          });
          if (currentToken) {
            setToken(currentToken);
          } else {
            console.log(
              'No registration token available. Request permission to generate one.',
            );
          }
        }
      }
    } catch (error) {
      console.log('An error occurred while retrieving token:', error);
    }
  };
  useEffect(() => {
    retrieveToken();
  }, []);
  return <></>;
};
