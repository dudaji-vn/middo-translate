'use client';

import { useAppStore } from '@/stores/app.store';
import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export const SideEffectProvider = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const setMobile = useAppStore((state) => state.setMobile);
  const setTablet = useAppStore((state) => state.setTablet);
  useEffect(() => {
    setMobile(isMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    setTablet(isTablet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTablet]);

  useEffect(() => {
    const handleMessage = async () => {
      const { onMessageListener } = await import('@/lib/firebase');
      onMessageListener();
    };
    handleMessage();

    // onMessageListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
