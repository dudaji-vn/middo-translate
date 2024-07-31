'use client';

import { useElectron } from "@/hooks/use-electron";
import { useEffect, useState } from "react";
import { notificationApi } from "../api";
import { useNotificationStore } from "../store";

export const FCMElectron = () => {
  const {isElectron, electron} = useElectron();
  const {
    setFcmToken,
    setIsSubscribed,
    setIsUnsubscribed,
  } = useNotificationStore((state) => state);

  useEffect(() => {
    if(!isElectron || !electron) return;
    electron?.getFCMToken('getFCMToken', async (_: any, token: string) => {
      await notificationApi.subscribe(token)
      setIsSubscribed(true);
      setIsUnsubscribed(false);
      setFcmToken(token);
    });
  }, [electron, isElectron]);

  return null;
};
