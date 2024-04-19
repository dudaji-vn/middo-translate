'use client';

import { useElectron } from '@/hooks/use-electron';
import ElectronNotification from './electron-notification';
import ElectronHandleMessage from './electron-handle-message';

interface INotification {
  body: string;
  messageId: string;
  title: string;
  url: string;
}

export default function ElectronHandler() {
  const { isElectron, ipcRenderer } = useElectron();
  if (!isElectron || !ipcRenderer) return;
  return (
    <>
        <ElectronNotification />
        <ElectronHandleMessage />
    </>
  );
}
