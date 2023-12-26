import { Mic, Smile } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/actions';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import EmojiPicker from 'emoji-picker-react';
import { TranslateTool } from './translate-tool';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/features/chat/store';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useTranslate } from '@/features/translate/hooks/use-translate';

export interface TextInputRef extends HTMLInputElement {
  reset: () => void;
  focus: () => void;
}
export const TextInput = forwardRef<
  TextInputRef,
  React.HTMLProps<HTMLInputElement>
>((props, ref) => {
  const userLanguage = useAuthStore((s) => s.user?.language) ?? 'en';
  const [disabled, setDisabled] = useState(false);
  const isMobile = useIsMobile();

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
        setMiddleText('');
        handleStopListening();
      },
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    [],
  );

  useEffect(() => {
    // enable submit form by enter
    const formRef = document.getElementById('message-editor');
    if (!formRef) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        formRef?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }
    };
    if (listening) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [listening]);

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
            onClick={() => {
              handleStopListening();
              inputRef.current?.focus();
            }}
            variant="ghost"
            className="self-end"
            size="sm"
            color="primary"
          >
            <Mic />
          </Button.Icon>
        ) : (
          <Button.Icon
            onClick={handleStartListening}
            variant="ghost"
            className="self-end"
            size="sm"
            color="default"
          >
            <Mic />
          </Button.Icon>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button.Icon variant="ghost" color="default" size="sm">
              <Smile />
            </Button.Icon>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={24}
            alignOffset={isMobile ? 0 : -14}
            align="end"
            className={cn(
              'w-fit border-none !bg-transparent p-0 shadow-none',
              isMobile && 'w-screen px-3',
            )}
          >
            <EmojiPicker
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
              searchDisabled
              autoFocusSearch={false}
              width={isMobile ? '100%' : ''}
              onEmojiClick={(emojiObj) => {
                setText(text + emojiObj.emoji);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 1);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <TranslateTool
        showTool={!!showTranslateOnType && !!text}
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
          setDisabled(false);
        }}
        onConfirm={() => {
          handleMiddleTranslate();
          setDisabled(false);
        }}
        onEdit={() => {
          setMiddleText(translatedText);
          setDisabled(true);
        }}
      />
      {disabled && (
        <div className="absolute left-0 top-0 h-full w-full bg-white opacity-80"></div>
      )}
    </>
  );
});

TextInput.displayName = 'TextInput';
