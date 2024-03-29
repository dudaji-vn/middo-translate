import { create } from 'zustand';

export type AppState = {
  isMobile: boolean;
  isTablet: boolean;
  loading: boolean;
  isShowConfirmLogout: boolean;
  platform: 'web' | 'mobile';
  currentAudio?: HTMLAudioElement;
  language: string;
};

export type AppActions = {
  setMobile: (isMobile: boolean) => void;
  setLoading: (loading: boolean) => void;
  setShowConfirmLogout: (isShowConfirmLogout: boolean) => void;
  setTablet: (isTablet: boolean) => void;
  setPlatform: (platform: 'web' | 'mobile') => void;
  setCurrentAudio: (audio: HTMLAudioElement) => void;
  setLanguage: (language: string) => void;
};

export const useAppStore = create<AppState & AppActions>()((set) => ({
  isMobile: false,
  isTablet: false,
  loading: false,
  isShowConfirmLogout: false,
  platform: 'web',
  language: 'en',
  setMobile: (isMobile) => set(() => ({ isMobile })),
  setLoading: (loading) => set(() => ({ loading })),
  setTablet: (isTablet) => set(() => ({ isTablet })),
  setPlatform: (platform) => set(() => ({ platform })),
  setShowConfirmLogout: (isShowConfirmLogout) =>
    set(() => ({ isShowConfirmLogout })),
  setCurrentAudio: (currentAudio) => set(() => ({ currentAudio })),
  setLanguage: (language) => set(() => ({ language })),
}));
