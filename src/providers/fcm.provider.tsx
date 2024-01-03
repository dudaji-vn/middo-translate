'use client';

import { BellIcon, XIcon } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';

import { NEXT_PUBLIC_FCM_PUBLIC_VAPID_KEY } from '@/configs/env.public';
import { firebaseApp } from '@/lib/firebase';
import toast from 'react-hot-toast';

export interface FCMProviderProps {}

export const FCMProvider = (props: FCMProviderProps) => {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );
  const [toastId, setToastId] = useState<string | undefined>(undefined);

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
            console.log('current token for client: ', currentToken);
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
    try {
      setPermission(Notification.permission);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  useEffect(() => {
    if (permission === 'default') {
      if (toastId) return;
      const id = toast.loading(
        (t) => {
          return (
            <div className="flex w-full">
              <span>
                Middo needs your permission to{' '}
                <span
                  onClick={retrieveToken}
                  className="cursor-pointer font-medium underline"
                >
                  enable desktop notifications.
                </span>
              </span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              >
                <XIcon width={20} height={20} />
              </button>
            </div>
          );
        },
        {
          icon: <BellIcon size={32} className="mx-1" />,
        },
      );

      setToastId(id);
    } else {
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
  }, [permission, toastId]);

  return <Fragment></Fragment>;
};
