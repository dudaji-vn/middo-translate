import { create } from 'zustand';

export type PlatformState = {
  platform: 'web' | 'mobile';
  notifyToken: string | null;
};

export type PlatformActions = {
  setPlatform: (platform: 'web' | 'mobile') => void;
  setNotifyToken: (token: string) => void;
};

export const usePlatformStore = create<PlatformState & PlatformActions>()(
  (set) => ({
    platform: 'web',
    setPlatform: (platform) => set(() => ({ platform })),
    notifyToken: null,
    setNotifyToken: (notifyToken) => set(() => ({ notifyToken })),
  }),
);
