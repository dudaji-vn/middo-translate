import { create } from 'zustand';

export type TranslateState = {
  value: string;
  setValue: (value: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isEnglishTranslate: boolean;
  setIsEnglishTranslate: (isEnglishTranslate: boolean) => void;
  textStyle: string;
  setTextStyle: (textStyle: string) => void;
};

export const useTranslateStore = create<TranslateState>()((set) => ({
  value: '',
  isListening: false,
  setValue: (value) => set({ value }),
  setIsListening: (isListening) => set({ isListening }),
  isFocused: false,
  setIsFocused: (isFocused) => set({ isFocused }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  isEnglishTranslate: true,
  setIsEnglishTranslate: (isEnglishTranslate) => set({ isEnglishTranslate }),
  textStyle: '',
  setTextStyle: (textStyle) => set({ textStyle }),
}));
