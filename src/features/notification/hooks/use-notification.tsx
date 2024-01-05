import { useEffect, useState } from 'react';

import { useNotificationStore } from '../store';

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );
  const { fcmToken, isDenied, setDenied, setFcmToken } = useNotificationStore(
    (state) => state,
  );
  const isShowRequestPermission = permission === 'default' && !isDenied;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
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
  };
};
