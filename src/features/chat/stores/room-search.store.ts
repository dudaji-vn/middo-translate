import { create } from 'zustand';
export type RoomSearchState = {
  isShowSearch: boolean;
};

export type RoomSearchActions = {
  setIsShowSearch: (isShowSearch: boolean) => void;
  toggleIsShowSearch: () => void;
};

export const useRoomSearchStore = create<RoomSearchState & RoomSearchActions>()(
  (set) => ({
    isShowSearch: false,
    setIsShowSearch: (isShowSearch) => set(() => ({ isShowSearch })),
    toggleIsShowSearch: () =>
      set((state) => ({ isShowSearch: !state.isShowSearch })),
  }),
);
