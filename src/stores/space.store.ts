import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { create } from 'zustand';

export type SpaceState = {
  space: TSpace | null;
  setSpace: (data: TSpace) => void;
};

export const useSpaceStore = create<SpaceState>()((set) => ({
  space: null,
  setSpace: (data: TSpace) => set(() => ({ space: data })),
}));
