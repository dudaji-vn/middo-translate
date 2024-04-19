'use client';

import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { useElectron } from '@/hooks/use-electron';
import { checkSeenMessage } from '@/services/message.service';
import { useCallback, useEffect } from 'react';
import { messageApi } from '../chat/messages/api';
import { useAuthStore } from '@/stores/auth.store';

interface IReplyContent {
    message: string;
    url: string;
}

export default function ElectronHandleMessage() {
//   useCheckSeenNotificationElectron();
    const user = useAuthStore((state) => state.user);
  const { isElectron, ipcRenderer } = useElectron();

  const replyNotification = useCallback(async (data: IReplyContent) => {
    try {
        if (!user?._id) return;
        const {message, url} = data;
        const roomId = url.split('/').pop();
        if (!roomId) return;
        const res = await messageApi.send({
            roomId: roomId, 
            content: message, 
            clientTempId: new Date().toISOString(),
            language: user?.language || 'en',
        });
        console.log('res', res);
    } catch (_) {}
  }, [user?._id, user?.language]);

  useEffect(() => {
    if (!isElectron || !ipcRenderer) return;
    ipcRenderer.on(
      ELECTRON_EVENTS.REPLY_NOTIFICATION,
      replyNotification,
    );
    return () => {
      if(!isElectron || !ipcRenderer) return;
      ipcRenderer.off(ELECTRON_EVENTS.REPLY_NOTIFICATION, replyNotification);
    };
  }, [isElectron, ipcRenderer, replyNotification]);
  return null;
}
