import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type ResetReason = 'logout' | '';
export type NotificationState = {
  fcmToken: string;
  isDenied: boolean;
  resetReason: ResetReason;
};

export type NotificationActions = {
  setFcmToken: (token: string) => void;
  setDenied: (isDenied: boolean) => void;
  reset: (reason: ResetReason) => void;
  setResetReason: (reason: ResetReason) => void;
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  persist(
    (set) => ({
      isDenied: false,
      setDenied: (isDenied) => set(() => ({ isDenied })),
      setResetReason: (reason) => set(() => ({ resetReason: reason })),
      resetReason: '',
      fcmToken: '',
      setFcmToken: (token) => set(() => ({ fcmToken: token })),
      reset: (reason: ResetReason) =>
        set(() => {
          return { isDenied: false, fcmToken: '', resetReason: reason };
        }),
    }),
    {
      name: 'notification-storage',
    },
  ),
);
