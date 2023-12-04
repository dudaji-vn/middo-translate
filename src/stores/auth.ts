import { create } from 'zustand';
import { AuthData } from '@/types';
import { registerService } from '@/services/authService';

export type AuthState = {
  isAuthentication: boolean;
  auth: any;
  loading: boolean;
  register: (data: AuthData) => Promise<void>;
};


export const useAuthStore = create<AuthState>()((set) => ({
  isAuthentication: false,
  auth: null,
  loading: false,
  register: async ({ email, password }: AuthData) => {
    const data = await registerService({ email, password });
    console.log(data)
  }
}));
