import { Media } from '@/components/media-light-box';
import { create } from 'zustand';

export type MediaLightBoxState = {
  index?: number;
  files: Media[];
};

export type MediaLightBoxActions = {
  setIndex: (index?: number) => void;
  setFiles: (files: Media[]) => void;
};

export const useMediaLightBoxStore = create<
  MediaLightBoxState & MediaLightBoxActions
>()((set) => ({
  index: undefined,
  files: [],
  setIndex: (index) => set({ index }),
  setFiles: (files) => set({ files }),
}));
