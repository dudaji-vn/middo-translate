'use client';

import './style.css';

import {
  CheckmarkCircle2Outline,
  CloseCircleOutline,
} from '@easy-eva-icons/react';

import { Button } from '@/components/actions';
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
    <div className="translateTextWrapper relative flex items-stretch gap-3">
      <textarea
        value={value}
        ref={textAreaRef}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={cn('inputTranslate  bg-transparent')}
        placeholder="hello"
      />
      <div className="flex flex-col justify-between">
        <Button.Icon
          onClick={handleCancel}
          variant="ghost"
          className="btn-icon -mt-3"
          color="default"
        >
          <CloseCircleOutline />
        </Button.Icon>
        <div className="">
          <Button.Icon disabled={!value} onClick={handleDone} color="success">
            <CheckmarkCircle2Outline />
          </Button.Icon>
        </div>
      </div>
    </div>
  );
};
