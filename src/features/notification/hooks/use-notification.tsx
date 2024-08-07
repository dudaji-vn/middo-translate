'use client';
import { useEffect, useMemo, useState } from 'react';

import { notificationApi } from '../api';
import { useNotificationStore } from '../store';
import toast from 'react-hot-toast';
import { useElectron } from '@/hooks/use-electron';
import customToast from '@/utils/custom-toast';

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );
  const { isElectron, ipcRenderer, electron } = useElectron();
  const {
    isDenied,
    setDenied,
    fcmToken,
    setFcmToken,
    isSubscribed,
    setIsSubscribed,
    isUnsubscribed,
    setIsUnsubscribed,
  } = useNotificationStore((state) => state);
  const isShowRequestPermission = useMemo(() => {
    if (isElectron) return false;
    if (isUnsubscribed) return false;
    if (isDenied) return false;
    if (permission === 'default') return true;
    if (permission === 'granted' && !isSubscribed) return true;
    return false;
  }, [isDenied, isElectron, isSubscribed, isUnsubscribed, permission]);

  const checkSubscription = async () => {
    if (isUnsubscribed) return;
    try {
      const { requestForToken } = await import('@/lib/firebase');
      const currentToken = await requestForToken();
      if (currentToken) {
        const isSubscribed =
          await notificationApi.checkSubscription(currentToken);
        setIsSubscribed(isSubscribed);
        if (isSubscribed) {
          setFcmToken(currentToken);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      if (currentPermission === 'granted') {
        checkSubscription();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveToken = async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        // Retrieve the notification permission status
        const permission = await Notification.requestPermission();
        setPermission(permission);
        // Check if permission is granted before retrieving the token
        if (permission === 'granted') {
          const { requestForToken } = await import('@/lib/firebase');
          const currentToken = await requestForToken();
          if (currentToken) {
            await notificationApi.subscribe(currentToken);
            setIsSubscribed(true);
            setIsUnsubscribed(false);
            setFcmToken(currentToken);
          } else {
            customToast.error(
              'No registration token available. Request permission to generate one.',
            );
            console.log(
              'No registration token available. Request permission to generate one.',
            );
          }
        }
      } else {
        customToast.error('Service worker is not supported in this browser.');
        console.log('Service worker is not supported in this browser.');
      }
    } catch (error) {
      customToast.error(
        'An error occurred while retrieving token, please try later.',
      );
      console.log('An error occurred while retrieving token:', error);
    }
  };

  const retrieveTokenElectron = async (): Promise<void> => {
    try {
      electron?.getFCMToken('getFCMToken', async (_: any, token: string) => {
        if(!token) return;
        await notificationApi.subscribe(token)
        setIsSubscribed(true);
        setIsUnsubscribed(false);
        setFcmToken(token);
      });
    } catch (error) {
      customToast.error(
        'An error occurred while retrieving token, please try later.',
      );
    }
  };

  // Check token for Electron app
  useEffect(()=>{
    const handleCheckElectronToken = async (token: string) => {
      const isSubscribed = await notificationApi.checkSubscription(token);
        setIsSubscribed(isSubscribed);
        if (isSubscribed) {
          setFcmToken(token);
        }
    }
    if(isElectron) {
      electron?.getFCMToken('getFCMToken', async (_: any, token: string) => {
          handleCheckElectronToken(token)
      });
    }
  }, [isElectron])


  const turnOff = async () => {
    try {
      if (fcmToken) {
        await notificationApi.unsubscribe(fcmToken);
        setIsSubscribed(false);
        setFcmToken('');
        setIsUnsubscribed(true);
      }
    } catch (error) {
      console.log('An error occurred while unsubscribing:', error);
    }
  };

  useEffect(() => {
    if (!fcmToken) {
      setIsSubscribed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fcmToken]);

  const handleSetPermission = (permission: NotificationPermission) => {
    setPermission(permission);
    if (permission === 'denied') {
      setDenied(true);
    }
  };
  return {
    isShowRequestPermission,
    permission,
    fcmToken,
    setPermission: handleSetPermission,
    setFcmToken,
    setIsSubscribed,
    isSubscribed,
    retrieveToken,
    retrieveTokenElectron,
    turnOff,
  };
};
