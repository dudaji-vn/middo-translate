import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type MSEditorState = {
  languageCode: string | 'auto' | null;
  detectedLanguage: string | null;
};

export type MSEditorActions = {
  setLanguageCode: (language: string) => void;
  setDetectedLanguage: (language: string | null) => void;
};

export const useMSEditorStore = create<MSEditorState & MSEditorActions>()(
  persist(
    (set) => ({
      languageCode: null,
      detectedLanguage: null,
      setLanguageCode: (language) => set({ languageCode: language }),
      setDetectedLanguage: (language) => set({ detectedLanguage: language }),
    }),
    {
      name: 'ms-editor-storage',
    },
  ),
);
