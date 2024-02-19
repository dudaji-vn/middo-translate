import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const MAX_RECENTLY_USED = 5;
type RecentlyType = 'source' | 'target';
export type LanguageState = {
  lastSourceUsed: string;
  lastTargetUsed: string;
  recentlySourceUsed: string[];
  recentlyTargetUsed: string[];
};

export type LanguageActions = {
  setRecentlyUsed: (recentlyUsed: string[], type: RecentlyType) => void;
  addRecentlyUsed: (recentlyUsed: string, type: RecentlyType) => void;
  removeRecentlyUsed: (recentlyUsed: string, type: RecentlyType) => void;
};

export const useLanguageStore = create<LanguageState & LanguageActions>()(
  persist(
    (set) => ({
      lastSourceUsed: 'auto',
      lastTargetUsed: 'en',
      recentlySourceUsed: ['auto', 'en', 'vi'],
      recentlyTargetUsed: ['en', 'ko', 'vi'],
      setRecentlyUsed: (recentlyUsed, type) =>
        set(() => {
          if (type === 'source') {
            return { recentlySourceUsed: recentlyUsed };
          }
          return { recentlyTargetUsed: recentlyUsed };
        }),
      addRecentlyUsed: (recentlyUsed, type) => {
        set((state) => {
          if (recentlyUsed === 'auto') {
            state.lastSourceUsed = recentlyUsed;
            return state;
          }

          const isSource = type === 'source';
          const recentlyUsedList = isSource
            ? state.recentlySourceUsed
            : state.recentlyTargetUsed;
          const index = recentlyUsedList.indexOf(recentlyUsed);

          if (index !== -1 && index < 3) {
            return isSource
              ? {
                  lastSourceUsed: recentlyUsed,

                  recentlySourceUsed: state.recentlySourceUsed,
                }
              : {
                  lastTargetUsed: recentlyUsed,
                  recentlyTargetUsed: state.recentlyTargetUsed,
                };
          }

          let updatedList = [
            recentlyUsed,
            ...recentlyUsedList.filter(
              (l) => l !== recentlyUsed && l !== 'auto',
            ),
          ];

          if (isSource) {
            updatedList = ['auto', ...updatedList];
          }

          if (updatedList.length > MAX_RECENTLY_USED) {
            updatedList.pop();
          }

          return isSource
            ? { recentlySourceUsed: updatedList }
            : { recentlyTargetUsed: updatedList };
        });
      },

      removeRecentlyUsed: (recentlyUsed, type) => {
        set((state) => {
          if (type === 'source') {
            const recentlySourceUsed = state.recentlySourceUsed.filter(
              (l) => l !== recentlyUsed,
            );
            return { recentlySourceUsed };
          }
          const recentlyTargetUsed = state.recentlyTargetUsed.filter(
            (l) => l !== recentlyUsed,
          );
          return { recentlyTargetUsed };
        });
      },
    }),
    {
      name: 'language-storage',
    },
  ),
);
