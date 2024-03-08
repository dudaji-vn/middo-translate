import { TPhraseItem } from '@/app/(main-layout)/_components/phrases/phrase-list-items';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { restoredState } from '@/utils/restore';

export type PhrasesState = {
  favoritePhrases: Record<string, number[]>;
  setFavoritePhrases: (favoritePhrases: Record<string, number[]>) => void;
  updateFavoritePhrases: (phraseName: string, optionCheckList: number[]) => void;
};
export const useFavoritePhrasesStore = create<PhrasesState>()(
  persist((set) => ({
    favoritePhrases: {},
    ...restoredState('phrases-storage'),
    setFavoritePhrases: (favoritePhrases) => set({ favoritePhrases }),
    updateFavoritePhrases: (phraseName, optionCheckList) =>
      set((state) => {
        const newFavoritePhrases = {
          ...state.favoritePhrases,
          [phraseName]: optionCheckList,
        };
        return {
          favoritePhrases: newFavoritePhrases,
        };
      }),
  }), {
    name: 'phrases-storage',
  }),
);
