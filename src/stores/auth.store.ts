import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { TStation } from '@/app/(main-layout)/(protected)/stations/_components/type';
import { User } from '@/features/users/types';
import { create } from 'zustand';

export type AuthState = {
  isAuthentication: boolean;
  isLoaded: boolean;
  user: User | null;
  loading: boolean;
  setData: (data: any) => void;
  isMobile: boolean;
  setIsMobile: (data: boolean) => void;
  space: TSpace | null;
  setSpace: (data: TSpace) => void;
  workStation: TStation | null;
  setWorkStation: (data: TStation) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthentication: false,
  auth: null,
  isLoaded: false,
  loading: false,
  user: null,
  setData: (data: any) => set(() => ({ ...data })),
  isMobile: false,
  setIsMobile: (data: boolean) => set(() => ({ isMobile: data })),
  space: null,
  setSpace: (data: TSpace) => set(() => ({ space: data })),
  workStation: null,
  setWorkStation: (data: TStation) => set(() => ({ workStation: data })),
}));
