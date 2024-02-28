import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { useMessageEditorText } from './message-editor-text-context';
import { useMediaUpload } from '@/components/media-upload';
import { useShortcutListenStore } from '@/stores/shortcut-listen.store';
import { MessageEditorToolbarMic } from './message-editor-toolbar-mic';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';

export interface TextInputRef extends HTMLTextAreaElement {
  reset: () => void;
  focus: () => void;
  onSubmit?: () => void;
}

export const TextInput = forwardRef<
  TextInputRef,
  React.HTMLProps<HTMLTextAreaElement> & {
    isToolbarShrink?: boolean;
  }
>(({ isToolbarShrink, onKeyDown, onBlur, onFocus, ...props }, ref) => {
  const {
    text,
    setText,
    setMiddleText,
    handleStopListening,
    listening,
    inputDisabled,
  } = useMessageEditorText();
  const isMobile = useAppStore((state) => state.isMobile);
  const { setAllowShortcutListener } = useShortcutListenStore();

  const { handlePasteFile } = useMediaUpload();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const triggerSubmit = () => {
    buttonRef.current?.click();
  };
  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if(text.length === 0) return;
    if (e.currentTarget.scrollHeight < 100) {
      e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
    } else {
      e.currentTarget.style.height = '120px';
    }
  };
  useImperativeHandle(
    ref,
    () => ({
      ...(inputRef.current as HTMLTextAreaElement),
      reset: () => {
        setText('');
        setMiddleText('');
        handleStopListening();
      },
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    if (text.length === 0) {
      inputRef.current?.style.setProperty('height', '24px');
    }
  }, [text]);

  return (
    <div className="relative flex  w-full  min-h-[36px] bg-red-300   flex-row items-center ">
      <button
        type="submit"
        className="invisible"
        ref={buttonRef}
        onClick={triggerSubmit}
      />
      <textarea
        id="message-editor-input"
        ref={inputRef}
        rows={1}
        onInput={onInput}
        {...props}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && text.length > 0) {
            e.preventDefault();
            triggerSubmit();
          }
          onKeyDown?.(e);
        }}
        value={text}
        onFocus={(e) => {
          if (listening) {
            handleStopListening();
          }
          setAllowShortcutListener(false);
          onFocus?.(e);
          onInput(e);
        }}
        onBlur={(e) => {
          setAllowShortcutListener(true);
          e.currentTarget.style.height = '24px';
          onBlur?.(e);
        }}
        style={{
          resize: 'none',
        }}
        onChange={(e) => {
          setText(e.target.value);
          setMiddleText('');
        }}
        className={cn(
          ' w-[calc(100%-30px)] bg-transparent outline-none',
          !isToolbarShrink && isMobile
            ? 'line-clamp-1 truncate text-ellipsis'
            : '',
        )}
        autoComplete="off"
        name="message"
        placeholder={listening ? 'Listening...' : 'Type a message'}
        onPaste={handlePasteFile}
      />
      <MessageEditorToolbarMic className="absolute -bottom-1 -right-1" />
    </div>
  );
});

TextInput.displayName = 'TextInput';
