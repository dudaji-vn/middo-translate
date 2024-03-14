'use client';

import { useElectron } from "@/hooks/use-electron";
import { useEffect, useState } from "react";
import { notificationApi } from "../api";

export const FCMElectron = () => {
  const {isElectron, electron} = useElectron();

  useEffect(() => {
    if(!isElectron || !electron) return;
    electron?.getFCMToken('getFCMToken', (_: any, token: string) => {
      notificationApi.subscribe(token)
        .then(()=>{
          console.log('Subscribed');
        })
        .catch((err)=> console.error);
    });
  }, [electron, isElectron]);

  return null;
};
