'use client';

import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { useElectron } from '@/hooks/use-electron';
import { checkSeenMessage } from '@/services/message.service';
import { useCallback, useEffect } from 'react';

interface INotification {
    body: string;
    messageId: string;
    title: string;
    url: string;
}

export default function ElectronNotification() {
//   useCheckSeenNotificationElectron();

  const { isElectron, ipcRenderer } = useElectron();

  const checkSeenNotification = useCallback(async (data: INotification) => {
    try {
        const res = await checkSeenMessage(data.messageId);
        const isSeen = res?.data?.seen;
        if (!isSeen) {
            ipcRenderer.send(ELECTRON_EVENTS.NOTIFICATION_NOT_SEEN, data);
        }
    } catch (_) {}
  }, [ipcRenderer]);

  useEffect(() => {
    if (!isElectron || !ipcRenderer) return;
    ipcRenderer.on(
      ELECTRON_EVENTS.CHECK_SEEN_NOTIFICATION,
      checkSeenNotification,
    );
    return () => {
      if(!isElectron || !ipcRenderer) return;
      ipcRenderer.off(ELECTRON_EVENTS.CHECK_SEEN_NOTIFICATION, checkSeenNotification);
    };
  }, [checkSeenNotification, isElectron, ipcRenderer]);
  return null;
}
