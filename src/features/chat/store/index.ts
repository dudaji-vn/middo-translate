import { create } from 'zustand';

export type ChatState = {
  showTranslateOnType: boolean;
  toggleShowTranslateOnType: () => void;
  showMiddleTranslation: boolean;
  toggleShowMiddleTranslation: () => void;
};

export const useChatStore = create<ChatState>()((set) => ({
  showTranslateOnType: true,
  toggleShowTranslateOnType: () =>
    set((state) => ({ showTranslateOnType: !state.showTranslateOnType })),
  showMiddleTranslation: true,
  toggleShowMiddleTranslation: () =>
    set((state) => ({ showMiddleTranslation: !state.showMiddleTranslation })),
}));
