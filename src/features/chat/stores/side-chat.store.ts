import { create } from 'zustand';
import { SidebarTabs } from '../types';
export type SideChatState = {
  currentSide: SidebarTabs | '';
};

export type SideChatActions = {
  setCurrentSide: (tab: SidebarTabs | '') => void;
};

export const useSideChatStore = create<SideChatState & SideChatActions>()(
  (set) => ({
    currentSide: '',
    setCurrentSide: (tab) => set({ currentSide: tab }),
  }),
);
