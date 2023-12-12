import { forwardRef, useImperativeHandle, useRef } from 'react';

import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { TranslateTool } from './translate-tool';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/features/chat/store';
import { useTranslate } from '@/features/translate/hooks/use-translate';

export interface TextInputRef extends HTMLInputElement {
  reset: () => void;
}
export const TextInput = forwardRef<
  TextInputRef,
  React.HTMLProps<HTMLInputElement>
>((props, ref) => {
  const userLanguage = useAuthStore((s) => s.user?.language) ?? 'en';

  const { text, setText, translatedText } = useTranslate({
    sourceLanguage: userLanguage,
    targetLanguage: DEFAULT_LANGUAGES_CODE.EN,
  });

  const { showTranslateOnType, toggleShowTranslateOnType } = useChatStore();
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(
    ref,
    () => ({
      ...(inputRef.current as HTMLInputElement),
      reset: () => {
        setText('');
      },
    }),
    [setText],
  );
  return (
    <>
      <input
        ref={inputRef}
        {...props}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-transparent outline-none"
        autoComplete="off"
        name="message"
        type="text"
        placeholder="Type a message"
      />
      <input type="hidden" name="messageEnglish" value={translatedText} />
      <TranslateTool
        showTool={!!showTranslateOnType && !!translatedText}
        checked={showTranslateOnType}
        onCheckedChange={toggleShowTranslateOnType}
        content={translatedText}
      />
    </>
  );
});

TextInput.displayName = 'TextInput';
