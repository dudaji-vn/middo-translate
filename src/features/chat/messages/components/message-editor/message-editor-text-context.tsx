'use client';

import { PropsWithChildren, createContext, useContext, useState } from 'react';

import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/features/chat/stores';
import { useTranslate } from '@/features/translate/hooks/use-translate';

interface MessageEditorTextContextProps {
  text: string;
  setText: (text: string) => void;
  translatedText: string;
  middleText: string;
  setMiddleText: (text: string) => void;
  handleMiddleTranslate: () => void;
  handleStartListening: (lang?: string) => void;
  handleStopListening: () => void;
  listening: boolean;
  userLanguage: string;
  inputDisabled: boolean;
  setInputDisabled: (disabled: boolean) => void;
  focusInput: () => void;
  setDetToSrc: () => void;
  isTranslating?: boolean;
}

export const MessageEditorTextContext =
  createContext<MessageEditorTextContextProps>(
    {} as MessageEditorTextContextProps,
  );

export const MessageEditorTextProvider = ({ children }: PropsWithChildren) => {
  const userLanguage = useAuthStore((s) => s.user?.language) ?? 'en';
  const [disabled, setDisabled] = useState(false);
  const scrLangStore = useChatStore((s) => s.srcLang);
  const setDetLang = useChatStore((s) => s.setDetLang);
  const {
    text,
    setText,
    translatedText,
    middleText,
    setMiddleText,
    handleMiddleTranslate,
    handleStartListening,
    handleStopListening,
    listening,
    setDetToSrc,
    isLoading,
  } = useTranslate({
    srcLang: scrLangStore,
    tgtLang: DEFAULT_LANGUAGES_CODE.EN,
    onDetectLanguage(lang) {
      setDetLang(lang);
    },
  });

  const focusInput = () => {
    const input = document.getElementById('message-editor-input');
    input?.focus();
  };
  return (
    <MessageEditorTextContext.Provider
      value={{
        text,
        setText,
        translatedText,
        middleText,
        setMiddleText,
        handleMiddleTranslate,
        handleStartListening,
        handleStopListening,
        listening,
        userLanguage,
        inputDisabled: disabled,
        setInputDisabled: setDisabled,
        focusInput,
        setDetToSrc,
        isTranslating: isLoading,
      }}
    >
      {children}
    </MessageEditorTextContext.Provider>
  );
};

export const useMessageEditorText = () => {
  const context = useContext(MessageEditorTextContext);
  if (!context) {
    throw new Error(
      'useMessageEditorText must be used within MessageEditorTextProvider',
    );
  }
  return context;
};
