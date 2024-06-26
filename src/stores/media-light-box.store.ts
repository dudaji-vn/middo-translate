import { Media } from '@/components/media-light-box';
import { create } from 'zustand';

export type MediaLightBoxState = {
  index?: number;
  files: Media[];
  setFiles: (files: Media[]) => void;
  setIndex: (index?: number) => void;
  fetchNextPage?: () => void;
  setFetchNextPage: (fetchNextPage?: () => void) => void;
};

export const useMediaLightBoxStore = create<MediaLightBoxState>()((set) => ({
  index: undefined,
  files: [],
  setFiles: (files: Media[]) => set({ files }),
  setIndex: (index?: number) => set({ index }),
  fetchNextPage: undefined,
  setFetchNextPage: (fetchNextPage?: () => void) => set({ fetchNextPage }),
}));
