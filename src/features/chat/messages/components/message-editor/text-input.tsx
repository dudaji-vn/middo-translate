import { forwardRef, useImperativeHandle, useRef } from 'react';

import { useMessageEditorText } from './message-editor.text-context';

export interface TextInputRef extends HTMLInputElement {
  reset: () => void;
  focus: () => void;
}
export const TextInput = forwardRef<
  TextInputRef,
  React.HTMLProps<HTMLInputElement>
>((props, ref) => {
  const {
    text,
    setText,
    setMiddleText,
    handleStopListening,
    listening,
    inputDisabled,
  } = useMessageEditorText();

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

  return (
    <>
      <div className="relative flex-1">
        <input
          id="message-editor-input"
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
      {inputDisabled && (
        <div className="absolute left-0 top-0 h-full w-full bg-white opacity-80"></div>
      )}
    </>
  );
});

TextInput.displayName = 'TextInput';
