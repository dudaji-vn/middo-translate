'use client';

import { firebaseApp, requestForToken } from '@/lib/firebase';
import { getMessaging, getToken } from 'firebase/messaging';

import { Button } from '@/components/actions';
import { NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY } from '@/configs/env.public';
import { useEffect } from 'react';

export interface FCMProviderProps {}

export const FCMProvider = (props: FCMProviderProps) => {
  const retrieveToken = async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const messaging = getMessaging(firebaseApp);
        // Retrieve the notification permission status
        const permission = await Notification.requestPermission();
        console.log('permission', permission);
        // Check if permission is granted before retrieving the token
        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY,
          });
          console.log('currentToken', currentToken);
          if (currentToken) {
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
    // retrieveToken();
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          retrieveToken();
        }}
      >
        test
      </Button>
    </>
  );
};
