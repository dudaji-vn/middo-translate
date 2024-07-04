import { ROUTE_NAMES } from '@/configs/route-name';
import { useStationNavigationData } from '@/hooks';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

export const LinkEventListener = () => {
  const { postMessage, isMobile } = useReactNativePostMessage();
  const router = useRouter();
  const { stationId } = useStationNavigationData();
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

      // check data-type attribute === 'mention'
      if (
        event.target instanceof HTMLSpanElement &&
        event.target.getAttribute('data-type') === 'mention'
      ) {
        event.preventDefault();
        event.stopPropagation();
        const id = event.target.getAttribute('data-id');
        if (id) {
          if (stationId) {
            router.push(
              `${ROUTE_NAMES.STATIONS}/${stationId}/conversations/${id}`,
            );
            return;
          }
          router.push(`${ROUTE_NAMES.ONLINE_CONVERSATION}/${id}`);
        }
      }
    });
    return () => {
      document.removeEventListener('click', () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, router, stationId]);
  return null;
};
