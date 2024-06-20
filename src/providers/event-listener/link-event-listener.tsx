import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { useEffect } from 'react';

export const LinkEventListener = () => {
  const { postMessage, isMobile } = useReactNativePostMessage();
  useEffect(() => {
    document.addEventListener('click', (event) => {
      if (
        event.target instanceof HTMLAnchorElement &&
        event.target.classList.contains('link')
      ) {
        if (!isMobile) return;
        event.preventDefault();
        const href = event.target.getAttribute('href');
        if (href) {
          postMessage({
            type: 'Trigger',
            data: {
              event: 'link',
              payload: {
                url: href,
              },
            },
          });
        }
      }
    });
    return () => {
      document.removeEventListener('click', () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);
  return null;
};
