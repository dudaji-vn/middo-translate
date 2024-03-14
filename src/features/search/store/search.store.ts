import { create } from 'zustand';

export type AppState = {
  searchValue: string;
};

export type AppActions = {
  setSearchValue: (searchValue: string) => void;
};

export const useSearchStore = create<AppState & AppActions>()((set) => ({
  searchValue: '',
  setSearchValue: (searchValue) => set(() => ({ searchValue })),
}));
