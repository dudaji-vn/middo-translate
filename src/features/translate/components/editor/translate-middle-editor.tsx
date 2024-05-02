'use client';

import './style.css';

import { Button } from '@/components/actions';
import { cn } from '@/utils/cn';
import { useSetParams } from '@/hooks/use-set-params';
import { useState } from 'react';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { isEqual } from 'lodash';

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
  useKeyboardShortcut(
    [SHORTCUTS.EDIT_ESL_TRANSLATION, SHORTCUTS.CONFIRM_ESL_TRANSLATED],
    (e, matchedKeys) => {
      if (isEqual(matchedKeys, SHORTCUTS.EDIT_ESL_TRANSLATION)) {
        handleCancel();
      } else if (isEqual(matchedKeys, SHORTCUTS.CONFIRM_ESL_TRANSLATED)) {
        handleDone();
      }
    },
  );

  return (
    <div className="translateTextWrapper relative flex flex-col items-stretch gap-3 !rounded-xl">
      <textarea
        value={value}
        ref={textAreaRef}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className={cn('inputTranslate  bg-transparent')}
        placeholder="Type your translation here"
      />
      <div className="flex justify-end gap-1">
        <Button
          size="xs"
          onClick={handleCancel}
          variant="ghost"
          color="default"
          shape="square"
        >
          Cancel
        </Button>
        <Button disabled={!value} onClick={handleDone} size="xs" shape="square">
          Save
        </Button>
      </div>
    </div>
  );
};
