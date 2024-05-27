import { useEffect, useMemo, useState } from 'react';

import { notificationApi } from '../api';
import { requestForToken } from '@/lib/firebase';
import { useNotificationStore } from '../store';
import { useElectron } from '@/hooks/use-electron';

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );
  const { isElectron } = useElectron();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { isDenied, setDenied } = useNotificationStore((state) => state);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const isShowRequestPermission = useMemo(() => {
    if (isElectron) return false;
    if (isDenied) return false;
    if (permission === 'default') return true;
    if (permission === 'granted' && !isSubscribed) return true;
    return false;
  }, [isDenied, isElectron, isSubscribed, permission]);

  const checkSubscription = async () => {
    try {
      const currentToken = await requestForToken();
      if (currentToken) {
        const isSubscribed =
          await notificationApi.checkSubscription(currentToken);
        setIsSubscribed(isSubscribed);
        console.log(isSubscribed);
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
  }, []);

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
  };
};
