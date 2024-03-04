import {
  THistoryItem,
  THistoryListItems,
} from '@/app/(main-layout)/_components/history/history';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HistoryState = {
  historyListItems: THistoryListItems;
  setHistoryListItems: (historyListItems: THistoryListItems) => void;
  pushHistoryItem: (item: THistoryItem) => void;
  removeHistoryItem: (item: THistoryItem) => void;
  clear: () => void;
  isHistoryListOpen: boolean;
  setIsHistoryListOpen: (isHistoryListOpen: boolean) => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      historyListItems: [],
      setHistoryListItems: (historyListItems) => set({ historyListItems }),
      pushHistoryItem: (historyItem) =>
        set((state) => ({
          historyListItems: [...state.historyListItems, historyItem],
        })),
      removeHistoryItem: (item) =>
        set((state) => ({
          historyListItems: state.historyListItems.filter(
            (historyItem) => historyItem !== item,
          ),
        })),
      clear: () => set({ historyListItems: [] }),
      isHistoryListOpen: false,
      setIsHistoryListOpen: (isHistoryListOpen) => set({ isHistoryListOpen }),
    }),
    {
      name: 'history-storage',
    },
  ),
);
