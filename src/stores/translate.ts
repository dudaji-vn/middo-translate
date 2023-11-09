import { create } from 'zustand';

export type TranslateState = {
  value: string;
  setValue: (value: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
};

export const useTranslateStore = create<TranslateState>()((set) => ({
  value: '',
  isListening: false,
  setValue: (value) => set({ value }),
  setIsListening: (isListening) => set({ isListening }),
  isFocused: false,
  setIsFocused: (isFocused) => set({ isFocused }),
}));
