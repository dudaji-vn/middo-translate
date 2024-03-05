'use client';

import { SPK_NOTIFY, SPK_PLATFORM } from '@/configs/search-param-key';
import { usePlatformStore } from '@/features/platform/stores';
import { getProfileService } from '@/services/auth.service';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export const SideEffectProvider = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const setData = useAuthStore((state) => state.setData);
  const { setMobile, setTablet } = useAppStore((state) => {
    return {
      setMobile: state.setMobile,
      setTablet: state.setTablet,
    };
  });
  const { setNotifyToken, setPlatform } = usePlatformStore((state) => {
    return {
      setPlatform: state.setPlatform,
      setNotifyToken: state.setNotifyToken,
    };
  });

  const searchParams = useSearchParams();
  const platform = searchParams?.get(SPK_PLATFORM) || 'web';
  const notify = searchParams?.get(SPK_NOTIFY);
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

  useEffect(() => {
    // for get user profile when tab is visible if user is logged in other tab with same browser
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const res = await getProfileService();
        const user = res.data;
        setData({
          user,
        });
      } else {
        console.log('hidden');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
