'use client';

import './style.css';

import { AcceptButton } from './accept-button';
import { CloseCircleOutline } from '@easy-eva-icons/react';
import { IconButton } from '../button';
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

  const handleCancel = () => {
    setParams([
      {
        key: 'edit',
        value: 'false',
      },
    ]);
  };

  return (
    <div className="translateTextWrapper relative">
      <textarea
        value={value}
        ref={textAreaRef}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={cn('inputTranslate  bg-transparent')}
        placeholder="hello"
      />
      <IconButton
        onClick={handleCancel}
        variant="ghost"
        className="btn-icon absolute right-3 top-3"
      >
        <CloseCircleOutline />
      </IconButton>
      <div className="flex justify-end">
        <AcceptButton onClick={handleDone} />
      </div>
    </div>
  );
};
