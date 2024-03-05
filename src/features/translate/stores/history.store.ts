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
const restoredState = () => {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return {};
  }
  const historyListItems = localStorage.getItem('history-storage');
  try {
    const parsedHistoryListItems = historyListItems
      ? JSON.parse(historyListItems)
      : [];
    if (parsedHistoryListItems) {
      return parsedHistoryListItems;
    }
  } catch (error) {
    console.error('Error parsing history storage', error);
  }
  return {};
};
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      historyListItems: [],
      ...restoredState,
      setHistoryListItems: (historyListItems) => set({ historyListItems }),
      pushHistoryItem: (historyItem) =>
        set((state) => ({
          //  stack
          historyListItems: [historyItem, ...state.historyListItems],
        })),
      removeHistoryItem: (item) =>
        set((state) => ({
          historyListItems: state.historyListItems.filter(
            (historyItem) => historyItem && historyItem?.id !== item?.id,
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
