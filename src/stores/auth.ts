import { create } from 'zustand';

export type AuthState = {
  isAuthentication: boolean;
  auth: any;
  loading: boolean;
  setData: (data: any) => void;
};


export const useAuthStore = create<AuthState>()((set) => ({
  isAuthentication: false,
  auth: null,
  loading: false,
  setData: (data: any) => set(() => ({ ...data }))
}));
