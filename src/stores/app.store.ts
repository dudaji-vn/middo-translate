import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { restoredState } from '@/utils/restore';

export type ThemeSetting = 'system' | 'light' | 'dark';
export type Theme = Exclude<ThemeSetting, 'system'>;

export type ThemeTrial = {
  theme: string;
  background: string;
};

export type AppState = {
  isMobile: boolean;
  isTablet: boolean;
  loading: boolean;
  isShowConfirmLogout: boolean;
  platform: 'web' | 'mobile';
  currentAudio?: HTMLAudioElement;
  language: string;
  theme?: Theme;
  themeSetting?: ThemeSetting;
  pingEmptyInbox?: boolean;
  socketConnected: boolean;
};

export type AppActions = {
  setMobile: (isMobile: boolean) => void;
  setLoading: (loading: boolean) => void;
  setShowConfirmLogout: (isShowConfirmLogout: boolean) => void;
  setTablet: (isTablet: boolean) => void;
  setPlatform: (platform: 'web' | 'mobile') => void;
  setCurrentAudio: (audio: HTMLAudioElement) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: Theme) => void;
  setThemeSetting: (themeSetting: ThemeSetting) => void;
  setPingEmptyInbox: (pingEmptyInbox: boolean) => void;
  setSocketConnected: (socketConnected: boolean) => void;
  toggleTheme: () => void;
  themeTrial: { theme: string; background: string } | null;
  setThemeTrial: (themeTrial: { theme: string; background: string }) => void;
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      isMobile: false,
      isTablet: false,
      loading: false,
      isShowConfirmLogout: false,
      platform: 'web',
      language: undefined,
      theme: undefined,
      themeSetting: undefined,
      pingEmptyInbox: false,
      socketConnected: false,
      setPingEmptyInbox: (pingEmptyInbox) => set(() => ({ pingEmptyInbox })),
      setMobile: (isMobile) => set(() => ({ isMobile })),
      setLoading: (loading) => set(() => ({ loading })),
      setTablet: (isTablet) => set(() => ({ isTablet })),
      setPlatform: (platform) => set(() => ({ platform })),
      setShowConfirmLogout: (isShowConfirmLogout) =>
        set(() => ({ isShowConfirmLogout })),
      setCurrentAudio: (currentAudio) => set(() => ({ currentAudio })),
      setLanguage: (language) => set(() => ({ language })),
      setTheme: (theme) => set(() => ({ theme })),
      setThemeSetting: (themeSetting) => set(() => ({ themeSetting })),
      setSocketConnected: (socketConnected) => set(() => ({ socketConnected })),
      themeTrial: null,
      setThemeTrial: (themeTrial) => set(() => ({ themeTrial })),
      toggleTheme: () =>
        set((state) => ({
          themeSetting: state.themeSetting === 'dark' ? 'light' : 'dark',
        })),
      ...restoredState('app-store'),
    }),
    { name: 'app-store' },
  ),
);
