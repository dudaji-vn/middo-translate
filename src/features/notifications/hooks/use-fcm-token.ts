import { firebaseApp, requestForToken } from '@/lib/firebase';
import { getMessaging, getToken } from 'firebase/messaging';
import { useEffect, useState } from 'react';

import { NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY } from '@/configs/env.public';

const useFcmToken = () => {
  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const messaging = getMessaging(firebaseApp);
          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();

          // Check if permission is granted before retrieving the token
          if (permission === 'granted') {
            const currentToken = await requestForToken();
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

    retrieveToken();
  }, []);
};

export default useFcmToken;
