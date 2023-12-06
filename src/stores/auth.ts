import { create } from 'zustand';

export type AuthState = {
  isAuthentication: boolean;
  isLoaded: boolean;
  auth: any;
  user: any;
  loading: boolean;
  setData: (data: any) => void;
};


export const useAuthStore = create<AuthState>()((set) => ({
  isAuthentication: false,
  auth: null,
  isLoaded: false,
  loading: false,
  user: null,
  setData: (data: any) => set(() => ({ ...data }))
}));
