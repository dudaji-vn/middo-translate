import { RoomsFilterOption } from '@/features/chat/rooms/components/filter/filter-section';
import { isEmpty, isEqual } from 'lodash';
import { create } from 'zustand';

const DEFAULT_FILTERS = {
  domains: [],
  tags: [],
  countries: [],
};
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
    filterOptions: DEFAULT_FILTERS,
    setFilterOptions: (filterOptions) => {
      set(() => ({
        filterOptions,
        selectedFilters: DEFAULT_FILTERS,
        appliedFilters: undefined,
      }));
    },
    selectedFilters: DEFAULT_FILTERS,
    setSelectedFilters: (selectedFilters) =>
      set(() => ({
        selectedFilters,
      })),
    appliedFilters: undefined,
    setFilterApplied: (appliedFilters) =>
      set(({ selectedFilters }) => {
        if (
          !isEqual(selectedFilters, appliedFilters) &&
          !isEmpty(appliedFilters)
        ) {
          return {
            selectedFilters: appliedFilters,
            appliedFilters,
          };
        }
        return {
          appliedFilters,
        };
      }),
  }),
);
