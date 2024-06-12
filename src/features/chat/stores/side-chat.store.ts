import { create } from 'zustand';
import { SidebarTabs } from '../types';
import { FilterType } from '../rooms/components/inbox/inbox-filter';
export type SideChatState = {
  currentSide: SidebarTabs | '';
  filters: Array<FilterType>;
};

export type SideChatActions = {
  setCurrentSide: (tab: SidebarTabs | '') => void;
  addFilters: (filters: [FilterType]) => void;
  removeFilters: (filters: [FilterType]) => void;
  setCurrentFilter: (filter: FilterType) => void;
};

export const useSideChatStore = create<SideChatState & SideChatActions>()(
  (set) => ({
    currentSide: '',
    setCurrentSide: (tab) => set({ currentSide: tab }),
    filters: [],
    addFilters: (filters) => set({ filters: [...filters] }),
    removeFilters: (filters) =>
      set({ filters: filters.filter((f) => !filters.includes(f)) }),
    setCurrentFilter: (filter) =>
      set((state) => {
        if (state.filters.includes(filter)) {
          return { filters: state.filters.filter((f) => f !== filter) };
        }
        return { filters: [...state.filters, filter] };
      }),
  }),
);
