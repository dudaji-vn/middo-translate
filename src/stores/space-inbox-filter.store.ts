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
  appliedFilters?: {
    domains: string[];
    tags: string[];
    countries: string[];
  };
  setFilterApplied: (
    applyFilters: SpaceInboxFilterState['appliedFilters'],
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
        isFilterApplied: false,
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
    appliedFilters: undefined,
    setFilterApplied: (appliedFilters) =>
      set(() => ({
        appliedFilters,
      })),
  }),
);
