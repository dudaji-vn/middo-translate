import { create } from 'zustand';
import { AuthData, Response } from '@/types';
import { loginService, registerService } from '@/services/authService';
import { toast } from '@/components/toast';

export type AuthState = {
  isAuthentication: boolean;
  auth: any;
  loading: boolean;
  setData: (data: any) => void;
  login: (data: AuthData) => Promise<void>;
};


export const useAuthStore = create<AuthState>()((set) => ({
  isAuthentication: false,
  auth: null,
  loading: false,
  setData: (data: any) => set(() => ({ ...data })),
  login: async ({ email, password }: AuthData) => {
    try {
      set(() => ({ loading: true }));
      
      const data = await loginService({ email, password });
      const { accessToken,  refreshToken, user } = data?.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set(() => ({ isAuthentication: true, auth: user }));

      toast({ title: 'Success', description: 'Login success'});
    } catch (error: any) {
      if(error?.response?.data?.message) {
        toast({ title: 'Error', description: error?.response?.data?.message });
      }
    } finally {
      set(() => ({ loading: false }));
    }
  },
}));
