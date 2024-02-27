import { forwardRef, use, useEffect, useImperativeHandle, useRef } from 'react';

import { useMessageEditorText } from './message-editor-text-context';
import { useMediaUpload } from '@/components/media-upload';
import { useShortcutListenStore } from '@/stores/shortcut-listen.store';
import { MessageEditorToolbarMic } from './message-editor-toolbar-mic';
import { m } from 'framer-motion';

export interface TextInputRef extends HTMLTextAreaElement {
  reset: () => void;
  focus: () => void;
}

export const TextInput = forwardRef<
  TextInputRef,
  React.HTMLProps<HTMLTextAreaElement>
>((props, ref) => {
  const {
    text,
    setText,
    setMiddleText,
    handleStopListening,
    listening,
    inputDisabled,
  } = useMessageEditorText();
  const { setAllowShortcutListener } = useShortcutListenStore();

  const { handlePasteFile } = useMediaUpload();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const triggerSubmit = () => {
    buttonRef.current?.click();
  }
  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
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
      inputRef.current?.style.setProperty('height', 'auto');
    }
  }, [text]);

  return (
    <>
      <div className="relative h-full flex-1 items-center">
        <button type='submit' className='invisible'
          ref={buttonRef}
          onClick={triggerSubmit}
        />
        <textarea
          id="message-editor-input"
          ref={inputRef}
          rows={1}
          onInput={onInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && text.length > 0) {
              e.preventDefault();
              triggerSubmit();
            }
          }}
          {...props}
          value={text}
          onFocus={() => setAllowShortcutListener(false)}
          onBlur={() => setAllowShortcutListener(true)}
          onChange={(e) => {
            setText(e.target.value);
            setMiddleText('');
          }}
          className="h-full w-full bg-transparent outline-none "
          autoComplete="off"
          name="message"
          placeholder={listening ? 'Listening...' : 'Type a message'}
          onPaste={handlePasteFile}
        />

        <MessageEditorToolbarMic className="absolute -right-2 bottom-0 z-10" />
        {listening && (
          <div className="absolute left-0 top-0 h-full w-full"></div>
        )}
      </div>
      {inputDisabled && (
        <div className="absolute left-0 top-0 h-full w-full bg-white opacity-80"></div>
      )}
    </>
  );
});

TextInput.displayName = 'TextInput';
