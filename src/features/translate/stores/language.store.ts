import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const MAX_RECENTLY_USED = 5;
type RecentlyType = 'source' | 'target';
export type LanguageState = {
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
      recentlySourceUsed: [''],
      recentlyTargetUsed: [''],
      setRecentlyUsed: (recentlyUsed, type) =>
        set(() => {
          if (type === 'source') {
            return { recentlySourceUsed: recentlyUsed };
          }
          return { recentlyTargetUsed: recentlyUsed };
        }),
      addRecentlyUsed: (recentlyUsed, type) => {
        set((state) => {
          if (type === 'source') {
            const recentlySourceUsed = state.recentlySourceUsed.filter(
              (l) => l !== recentlyUsed,
            );
            recentlySourceUsed.unshift(recentlyUsed);
            if (recentlySourceUsed.length > MAX_RECENTLY_USED) {
              recentlySourceUsed.pop();
            }
            return { recentlySourceUsed };
          }
          const recentlyTargetUsed = state.recentlyTargetUsed.filter(
            (l) => l !== recentlyUsed,
          );
          recentlyTargetUsed.unshift(recentlyUsed);
          if (recentlyTargetUsed.length > MAX_RECENTLY_USED) {
            recentlyTargetUsed.pop();
          }
          return { recentlyTargetUsed };
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
