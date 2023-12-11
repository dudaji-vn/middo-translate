import { create } from 'zustand';

export type ChatState = {
  showTranslateOnType: boolean;
  toggleShowTranslateOnType: () => void;
};

export const useChatStore = create<ChatState>()((set) => ({
  showTranslateOnType: true,
  toggleShowTranslateOnType: () =>
    set((state) => ({ showTranslateOnType: !state.showTranslateOnType })),
}));
