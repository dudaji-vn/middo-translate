'use client';

import { trackGuest } from '@/services/extension.service';
import { LSK_FROM_DOMAIN, LSK_TRACKING_VISIT_ID } from '@/types/business.type';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TrackGuest = ({
  children,
  invalidDomain = false,
  ...guestProps
}: { extensionId: string; domain: string; invalidDomain: boolean } & {
  children?: React.ReactNode;
}) => {
  const { t } = useTranslation('common');
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

  if (invalidDomain) {
    return (
      <section className="flex h-screen items-center justify-center">
        <h4 className="text-2xl font-semibold text-primary-500-main">
          {t('EMBED_SCRIPT.INVALID_DOMAIN.TITLE')}
        </h4>
        <p className="text-lg font-light text-neutral-800">
          {t('EMBED_SCRIPT.INVALID_DOMAIN.DESCRIPTION')}
        </p>
      </section>
    );
  }

  return <>{children}</>;
};

export default TrackGuest;
