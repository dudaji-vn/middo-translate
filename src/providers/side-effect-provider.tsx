'use client';

import { useAppStore } from '@/stores/app.store';
import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export const SideEffectProvider = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const setMobile = useAppStore((state) => state.setMobile);
  useEffect(() => {
    setMobile(isMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);
  return <></>;
};
