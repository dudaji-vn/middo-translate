'use client';

import { SPK_NOTIFY, SPK_PLATFORM } from '@/configs/search-param-key';
import { usePlatformStore } from '@/features/platform/stores';
import { useAppStore } from '@/stores/app.store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export const SideEffectProvider = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const setMobile = useAppStore((state) => state.setMobile);
  const setTablet = useAppStore((state) => state.setTablet);
  const setPlatform = usePlatformStore((state) => state.setPlatform);
  const setNotifyToken = usePlatformStore((state) => state.setNotifyToken);
  const searchParams = useSearchParams();
  const platform = searchParams?.get(SPK_PLATFORM) || 'web';
  const notify = searchParams?.get(SPK_NOTIFY);
  console.log('notify', notify);
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
  }, []);
  useEffect(() => {
    setPlatform(platform as 'web' | 'mobile');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  useEffect(() => {
    if (notify) {
      setNotifyToken(notify);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notify]);

  return <></>;
};
