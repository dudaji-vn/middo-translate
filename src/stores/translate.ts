import { createStore } from 'zustand';

export type TranslateStore = {
	sourceLanguage: string;
	targetLanguage: string;
	setSourceLanguage: (language: string) => void;
	setTargetLanguage: (language: string) => void;
};

export const translateStore = createStore<TranslateStore>((set) => ({
	sourceLanguage: 'en',
	targetLanguage: 'en',
	setSourceLanguage: (language: string) => set({ sourceLanguage: language }),
	setTargetLanguage: (language: string) => set({ targetLanguage: language }),
}));
