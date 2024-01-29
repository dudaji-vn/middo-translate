import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type NotificationState = {
  fcmToken: string;
  isDenied: boolean;
};

export type NotificationActions = {
  setFcmToken: (token: string) => void;
  setDenied: (isDenied: boolean) => void;
  reset: () => void;
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  persist(
    (set) => ({
      isDenied: false,
      setDenied: (isDenied) => set(() => ({ isDenied })),
      resetReason: '',
      fcmToken: '',
      setFcmToken: (token) => set(() => ({ fcmToken: token })),
      reset: () =>
        set(() => {
          return { isDenied: false, fcmToken: '' };
        }),
    }),
    {
      name: 'notification-storage',
    },
  ),
);
