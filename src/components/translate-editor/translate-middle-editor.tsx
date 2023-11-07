'use client';

import './style.css';

import { CheckmarkCircle2Outline } from '@easy-eva-icons/react';
import { cn } from '@/utils/cn';
import { useSetParams } from '@/hooks/use-set-params';
import { useState } from 'react';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';

export interface TranslateMiddleEditorProps {
  defaultText?: string;
}

export const TranslateMiddleEditor = ({
  defaultText,
}: TranslateMiddleEditorProps) => {
  const [value, setValue] = useState(defaultText || '');
  const { setParams } = useSetParams();
  const { textAreaRef } = useTextAreaResize(value);

  const handleDone = () => {
    const newParams = [
      {
        key: 'edit',
        value: 'false',
      },
      {
        key: 'query',
        value: '',
      },
    ];
    if (value) {
      newParams.push({
        key: 'mquery',
        value,
      });
    }
    setParams(newParams);
  };

  return (
    <div className="translateTextWrapper">
      <textarea
        value={value}
        ref={textAreaRef}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={cn('inputTranslate  bg-transparent')}
        placeholder="hello"
      />

      <button onClick={handleDone} className="smallButton ml-auto">
        <CheckmarkCircle2Outline className="h-7 w-7 " />
        <div className="buttonText">Done</div>
      </button>
    </div>
  );
};
