import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type DraftState = {
  draft: {
    [key: string]: string;
  };
};

export type DraftActions = {
  setDraft: (key: string, value: string) => void;
  clearDraft: (key: string) => void;
};

export const useDraftStore = create<DraftState & DraftActions>()(
  persist(
    (set) => ({
      draft: {},
      setDraft: (key, value) =>
        set((state) => ({ draft: { ...state.draft, [key]: value } })),
      clearDraft: (key) =>
        set((state) => ({ draft: { ...state.draft, [key]: '' } })),
    }),
    {
      name: 'draft-storage',
    },
  ),
);
