'use client';

import { trackGuest } from '@/services/extension.service';
import { LSK_FROM_DOMAIN, LSK_TRACKING_VISIT_ID } from '@/types/business.type';
import React, { useCallback, useEffect } from 'react';

const TrackGuest = ({
  children,
  ...guestProps
}: { extensionId: string; domain: string } & {
  children?: React.ReactNode;
}) => {
  const onTrackingGuest = useCallback(
    async (params: { extensionId: string; domain: string }) => {
      const trackingId = localStorage.getItem(LSK_TRACKING_VISIT_ID);
      const data = await trackGuest({
        ...params,
        ...(trackingId && { trackingId }),
      });
      const id = data?.data?._id;
      if (id) {
        localStorage.setItem(LSK_TRACKING_VISIT_ID, id);
      } else {
        localStorage.removeItem(LSK_TRACKING_VISIT_ID);
      }
    },
    [],
  );

  useEffect(() => {
    localStorage.setItem(LSK_FROM_DOMAIN, guestProps.domain);
    onTrackingGuest(guestProps);
  }, [guestProps, onTrackingGuest]);

  return <>{children}</>;
};

export default TrackGuest;
