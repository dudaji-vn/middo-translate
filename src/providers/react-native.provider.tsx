'use-client';

import { useNotificationStore } from '@/features/notification/store';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export type NativeEventData = {
  type: 'Trigger' | 'Console' | 'Init';
  data: any;
};

type InitType = {
  key: 'notification' | 'theme' | 'language' | 'user' | 'settings' | 'app';
  value: any;
};

export const ReactNativeProvider = () => {
  const setInitial = useNotificationStore((state) => state.setInitial);
  useEffect(() => {
    const handleMessage = (event: any) => {
      try {
        const { type, data } = JSON.parse(event.data) as NativeEventData;
        switch (type) {
          case 'Trigger':
            toast.success(data);
            break;
          case 'Console':
            console.log(data);
            break;
          case 'Init':
            const { key, value } = data as InitType;
            switch (key) {
              case 'notification':
                const {
                  isSubscribed = false,
                  isDenied = false,
                  fcmToken = '',
                  isUnsubscribed = false,
                } = value;
                setInitial({
                  isSubscribed,
                  isDenied,
                  fcmToken,
                  isUnsubscribed,
                });
                break;
              case 'theme':
                break;
              case 'language':
                break;
              case 'user':
                break;
              case 'settings':
                break;
              case 'app':
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const isUIWebView = () => {
      return navigator.userAgent
        .toLowerCase()
        .match(/\(ip.*applewebkit(?!.*(version|crios))/);
    };

    const receiver = isUIWebView() ? window : document;

    receiver.addEventListener('message', handleMessage);

    return () => {
      receiver.removeEventListener('message', handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};
