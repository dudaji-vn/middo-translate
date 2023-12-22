import { useEffect } from 'react';

export const useRequirePushNotify = () => {
  useEffect(() => {
    const permission = Notification.permission;
    console.log('permission', permission);
    if (permission === 'denied') {
      console.log('denied');
      alert('You need to allow push notification in order to use this app');
    } else if (permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'denied') {
          alert('You need to allow push notification in order to use this app');
        }
      });
    }
  }, []);
};
