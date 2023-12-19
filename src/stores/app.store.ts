import { create } from 'zustand';

export type AppState = {
  isMobile: boolean;
  loading: boolean;
  isShowConfirmLogout: boolean;
};

export type AppActions = {
  setMobile: (isMobile: boolean) => void;
  setLoading: (loading: boolean) => void;
  setShowConfirmLogout: (isShowConfirmLogout: boolean) => void;
};

export const useAppStore = create<AppState & AppActions>()((set) => ({
  isMobile: false,
  loading: false,
  isShowConfirmLogout: false,
  setMobile: (isMobile) => set(() => ({ isMobile })),
  setLoading: (loading) => set(() => ({ loading })),
  setShowConfirmLogout: (isShowConfirmLogout) =>
    set(() => ({ isShowConfirmLogout })),
}));
