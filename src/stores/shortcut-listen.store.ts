import { create } from 'zustand';

export type ShortcutListenState = {
  allowShortcutListener: boolean;
  setAllowShortcutListener: (isListening: boolean) => void;
};

export const useShortcutListenStore = create<ShortcutListenState>()((set) => ({
  allowShortcutListener: true,
  setAllowShortcutListener: (allowShortcutListener) => set({ allowShortcutListener}),
}));
