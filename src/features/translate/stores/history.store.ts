import {
  THistoryItem,
  THistoryListItems,
} from '@/app/(main-layout)/_components/history/history';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { restoredState } from '@/utils/restore';

export type HistoryState = {
  historyListItems: THistoryListItems;
  setHistoryListItems: (historyListItems: THistoryListItems) => void;
  pushHistoryItem: (item: THistoryItem) => void;
  removeHistoryItem: (item: THistoryItem) => void;
  pushWithNoDuplicate: (newItem: THistoryItem) => void;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      historyListItems: [],
      ...restoredState('history-storage'),
      setHistoryListItems: (historyListItems) => set({ historyListItems }),
      pushHistoryItem: (historyItem) =>
        set((state) => ({
          //  stack
          historyListItems: [historyItem, ...state.historyListItems],
        })),
      pushWithNoDuplicate: (newItem) =>
        set((state) => {
          const existingItemIndex = state.historyListItems?.findIndex((item) => {
            const old = item.src.content;
            const newStr = newItem.src.content;
            return newStr?.toLowerCase()?.trim()?.includes(old?.toLowerCase()?.trim());// || str1?.toLowerCase()?.trim()?.includes(str2?.toLowerCase()?.trim());
          });
          console.log('existingItemIndex', existingItemIndex);

          if (existingItemIndex !== -1) {
            const newHistoryList = [...state.historyListItems];
            newHistoryList.splice(existingItemIndex, 1);
            newHistoryList.unshift(newItem);
            return { historyListItems: newHistoryList };
          } else {
            return {
              historyListItems: [newItem, ...state.historyListItems],
            };
          }
        }),

      removeHistoryItem: (item) =>
        set((state) => ({
          historyListItems: state.historyListItems.filter(
            (historyItem) => historyItem && historyItem?.id !== item?.id,
          ),
        })),
      clear: () => set({ historyListItems: [] }),
    }),
    {
      name: 'history-storage',
    },
  ),
);
