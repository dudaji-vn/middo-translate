import { Mic, Smile } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Button } from '@/components/actions';
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
  const [disabled, setDisabled] = useState(false);

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
  } = useTranslate({
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
      <div className="relative flex-1">
        <input
          ref={inputRef}
          {...props}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setMiddleText('');
          }}
          className="h-full w-full bg-transparent outline-none"
          autoComplete="off"
          name="message"
          type="text"
          placeholder={listening ? 'Listening...' : 'Type a message'}
        />
        {listening && (
          <div className="absolute left-0 top-0 h-full w-full"></div>
        )}
      </div>
      <div className="h-full items-end">
        {listening ? (
          <Button.Icon
            onClick={handleStopListening}
            variant="ghost"
            className="self-end"
            color="primary"
          >
            <Mic />
          </Button.Icon>
        ) : (
          <Button.Icon
            onClick={handleStartListening}
            variant="ghost"
            className="self-end"
            color="default"
          >
            <Mic />
          </Button.Icon>
        )}

        <Button.Icon variant="ghost" className="self-end" color="default">
          <Smile />
        </Button.Icon>
      </div>
      <TranslateTool
        showTool={!!showTranslateOnType && !!translatedText}
        checked={showTranslateOnType}
        onCheckedChange={toggleShowTranslateOnType}
        content={translatedText}
        isEditing={!!middleText}
        middleText={middleText}
        setMiddleText={setMiddleText}
        onEditStateChange={(isEditing) => {
          setDisabled(isEditing);
          if (disabled) {
            inputRef.current?.focus();
          }
        }}
        onCancel={() => {
          setMiddleText('');
        }}
        onConfirm={() => {
          handleMiddleTranslate();
        }}
        onEdit={() => {
          setMiddleText(translatedText);
        }}
      />
      {disabled && (
        <div className="absolute left-0 top-0 h-full w-full bg-white opacity-80"></div>
      )}
    </>
  );
});

TextInput.displayName = 'TextInput';
