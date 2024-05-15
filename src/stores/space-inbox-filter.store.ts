import { RoomsFilterOption } from '@/features/chat/rooms/components/filter/filter-section';
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
        selectedFilters: {
          domains: filterOptions?.domains?.map((d) => d.value) || [],
          tags: filterOptions?.tags?.map((t) => t.value) || [],
          countries: filterOptions?.countries?.map((c) => c.value) || [],
        },
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
