import { NEXT_PUBLIC_NAME } from '@/configs/env.public';
import { useHasFocus } from '@/features/chat/rooms/hooks/use-has-focus';
import { useEffect } from 'react';

export const useChangeTitle = ({
  notification,
  setNotification,
}: {
  notification: string;
  setNotification: (message: string) => void;
}) => {
  const isFocused = useHasFocus();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (notification && !isFocused) {
      intervalId = setInterval(() => {
        const defaultTitle = `Talk | ${NEXT_PUBLIC_NAME}`;
        document.title =
          document.title === `Talk | ${NEXT_PUBLIC_NAME}`
            ? notification
            : defaultTitle;
      }, 1000);
    }
    if (isFocused) {
      document.title = `Talk | ${NEXT_PUBLIC_NAME}`;
      setNotification('');
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isFocused, notification, setNotification]);
};
