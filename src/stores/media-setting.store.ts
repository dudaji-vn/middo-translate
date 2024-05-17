import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { restoredState } from '@/utils/restore';

export type MediaSettingState = {
  volume: number; // 0 - 1
  setVolume: (volume: number) => void;
  clear: () => void;
};

export const useMediaSettingStore = create<MediaSettingState>()(
  persist(
    (set) => ({
      volume: 1,
      setVolume: (volume: number) => {
        // Check if volume is between 0 and 1
        if (volume < 0) {
          volume = 0;
        } else if (volume > 1) {
          volume = 1;
        }
        set({ volume });
      },
      ...restoredState('media-setting'),
    }),
    {
      name: 'media-setting',
    },
  ),
);
