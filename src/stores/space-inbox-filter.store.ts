import { RoomsFilterOption } from '@/features/chat/rooms/components/rooms.modal-filter';
import { create } from 'zustand';

export type SpaceInboxFilterState = {
  filterOptions: {
    domains: RoomsFilterOption[];
    tags: RoomsFilterOption[];
    countries: RoomsFilterOption[];
  };
  setFilterOptions: (
    filterOptions: SpaceInboxFilterState['filterOptions'],
  ) => void;
  selectedFilters: {
    domains: string[];
    tags: string[];
    countries: string[];
  };
  setSelectedFilters: (
    selectedFilters: SpaceInboxFilterState['selectedFilters'],
  ) => void;
};

export const useSpaceInboxFilterStore = create<SpaceInboxFilterState>()(
  (set) => ({
    filterOptions: {
      domains: [],
      tags: [],
      countries: [],
    },
    setFilterOptions: (filterOptions) =>
      set(() => ({
        filterOptions,
      })),
    selectedFilters: {
      domains: [],
      tags: [],
      countries: [],
    },
    setSelectedFilters: (selectedFilters) =>
      set(() => ({
        selectedFilters,
      })),
  }),
);
