import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type NotificationState = {
  fcmToken: string;
  isDenied: boolean;
  isSubscribed: boolean;
  isUnsubscribed: boolean;
};

export type NotificationActions = {
  setFcmToken: (token: string) => void;
  setIsSubscribed: (isSubscribed: boolean) => void;
  setIsUnsubscribed: (isSubscribed: boolean) => void;
  setDenied: (isDenied: boolean) => void;
  reset: () => void;
  setInitial: (initial: NotificationState) => void;
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  persist(
    (set) => ({
      isUnsubscribed: false,
      isSubscribed: true,
      setIsSubscribed: (isSubscribed) => set(() => ({ isSubscribed })),
      isDenied: false,
      setDenied: (isDenied) => set(() => ({ isDenied })),
      resetReason: '',
      fcmToken: '',
      setFcmToken: (token) => set(() => ({ fcmToken: token })),
      reset: () =>
        set(() => {
          return { isSubscribed: true, isDenied: false, fcmToken: '' };
        }),
      setIsUnsubscribed: (isUnsubscribed) => set(() => ({ isUnsubscribed })),
      setInitial: (initial) => set(() => initial),
    }),
    {
      name: 'notification-storage',
    },
  ),
);
