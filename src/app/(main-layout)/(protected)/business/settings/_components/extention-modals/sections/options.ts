import { Message } from "@/features/chat/messages/types";

export interface TThemeOption {
  hex: string;
}

export const DEFAULT_THEME = '#3D88ED';
export const extentionsCustomThemeOptions: TThemeOption[] = [
  {
    hex: '#EF3B36',
  },
  {
    hex: '#E11D59',
  },
  {
    hex: '#8E23A3',
  },
  {
    hex: '#5A33AA',
  },
  {
    hex: '#3649A8',
  },
  {
    hex: '#3D88ED',
  },
];

export type TExtensionFirstMessage = Pick<Message, 'content' | 'contentEnglish' | 'language'>;

export const DEFAULT_FIRST_MESSAGE: TExtensionFirstMessage = {
  content: 'Xin chào, tôi có thể giúp gì cho bạn?',
  contentEnglish: 'Hello, how can I help you?',
  language: 'vi',
}