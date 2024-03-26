import { Message } from '@/features/chat/messages/types';

export interface TThemeOption {
  hex: string;
  name: string;
}

export const DEFAULT_THEME = '#3D88ED'
export const extentionsCustomThemeOptions: TThemeOption[] = [
  {
    name: 'default',
    hex: '#3D88ED',
  },
  {
    name: 'halloween',
    hex: '#ff5e00',
  },
  {
    name: 'rose',
    hex: '#ff005e',
  },
  {
    name: 'violet',
    hex: '#5e00ff',
  },
  {
    name: 'sky',
    hex: '#00b3ff',
  },
  {
    name: 'forest',
    hex: '#139e70',
  },
  {
    name: 'lemon',
    hex: '#a6ff00',
  },
];

export type TExtensionFirstMessage = Pick<
  Message,
  'content' | 'contentEnglish' | 'language'
>;

export const DEFAULT_FIRST_MESSAGE: TExtensionFirstMessage = {
  content: 'Hello, how can I help you?',
  contentEnglish: 'Hello, how can I help you?',
  language: 'vi',
};
