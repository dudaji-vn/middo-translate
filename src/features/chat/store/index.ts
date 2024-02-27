import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChatState = {
  showTranslateOnType: boolean;
  toggleShowTranslateOnType: () => void;
  showMiddleTranslation: boolean;
  toggleShowMiddleTranslation: () => void;
  rooIdInteract: string | null;
  setRoomIdInteract: (id: string) => void;
  srcLang: string;
  setSrcLang: (lang: string) => void;
  detLang: string;
  setDetLang: (lang: string) => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      showTranslateOnType: true,
      toggleShowTranslateOnType: () =>
        set((state) => ({ showTranslateOnType: !state.showTranslateOnType })),
      showMiddleTranslation: true,
      toggleShowMiddleTranslation: () =>
        set((state) => ({
          showMiddleTranslation: !state.showMiddleTranslation,
        })),
      rooIdInteract: null,
      setRoomIdInteract: (id) => set(() => ({ rooIdInteract: id })),
      srcLang: 'auto',
      setSrcLang: () => set(() => ({ srcLang: 'auto' })),
      detLang: '',
      setDetLang: (lang) => set(() => ({ detLang: lang })),
    }),
    {
      name: 'chat-storage',
    },
  ),
);
