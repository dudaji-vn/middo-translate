import { create } from 'zustand';

export type AppState = {
  loading: boolean;
  isShowConfirmLogout: boolean;
  setData: (data: any) => void;
};


export const useAppStore = create<AppState>()((set) => ({
  loading: false,
  isShowConfirmLogout: false,
  setData: (data: any) => set(() => ({ ...data }))
}));
