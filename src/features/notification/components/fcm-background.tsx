'use client';

import { Fragment, useEffect, useState } from 'react';

import { requestForToken } from '@/lib/firebase';
import { BellIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationApi } from '../api';
import { useNotification } from '../hooks/use-notification';
import { ToastNotification } from './toast-notification';

export interface FCMBackgroundProps {}

export const FCMBackground = (props: FCMBackgroundProps) => {
  const { isShowRequestPermission, setPermission, setIsSubscribed } =
    useNotification();

  const [toastId, setToastId] = useState<string | undefined>(undefined);

  const retrieveToken = async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        // Retrieve the notification permission status
        const permission = await Notification.requestPermission();
        setPermission(permission);
        // Check if permission is granted before retrieving the token
        if (permission === 'granted') {
          const currentToken = await requestForToken();
          if (currentToken) {
            await notificationApi.subscribe(currentToken);
            setIsSubscribed(true);
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
    if (isShowRequestPermission) {
      if (toastId) return;
      const id = toast.loading(
        (t) => (
          <ToastNotification
            onDismiss={() => {
              toast.dismiss(t.id);
            }}
            onEnable={() => {
              retrieveToken();
            }}
            onDeny={() => {
              setPermission('denied');
            }}
          />
        ),
        {
          icon: <BellIcon size={20} className="mx-1" />,
          className: '!max-w-none',
        },
      );

      setToastId(id);
    } else {
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowRequestPermission, toastId]);

  useEffect(() => {
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [toastId]);

  return <Fragment></Fragment>;
};
