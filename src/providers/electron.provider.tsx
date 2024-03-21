'use client';

import { useCallback, useEffect } from 'react';

import { useElectron } from '@/hooks/use-electron';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { useRouter } from 'next/navigation';
const ElectronProvider = () => {
  const { isElectron, ipcRenderer } = useElectron();
  const router = useRouter();
  const openPage  = useCallback((url: string) => {
    let urlObj = new URL(url);
    let path = urlObj.pathname;
    if(path) {
        router.push(path);
    }
  }, [router]);
  useEffect(() => {
    if(isElectron) {
      ipcRenderer.on(ELECTRON_EVENTS.OPEN_URL, openPage);
    }
    return () => {
        if (!ipcRenderer) return;
        ipcRenderer.off(ELECTRON_EVENTS.OPEN_URL, openPage);
    };

  }, [ipcRenderer, isElectron, openPage]);

  return null;
};

export default ElectronProvider;
