'use client';

import './style.css';

import { CheckCircle2Icon, Edit2Icon } from 'lucide-react';

import { Button } from '@/components/actions';
import { CircleFlag } from 'react-circle-flags';
import Highlighter from 'react-highlight-words';
import { cn } from '@/utils/cn';
import { useCompare } from '@/features/translate/context/compare';
import { useMemo } from 'react';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { isEqual } from 'lodash';

export interface TranslateMiddleProps {
  text: string;
  textCompare: string;

  children?: React.ReactNode;
  type?: 'edit' | 'accept';
  isEdit?: boolean;
}

export const TranslateMiddle = ({
  text,

  textCompare,
  type = 'edit',
  isEdit = false,
}: TranslateMiddleProps) => {
  const { isMatch, acceptUnMatch, editUnMatch } = useCompare();
  const diffWords = useMemo(() => {
    if (isMatch) return [];
    const result: string[] = [];
    const words = text.toLocaleLowerCase().split(' ');
    const compareWords = textCompare.toLocaleLowerCase().split(' ');
    for (let i = 0; i < words.length; i++) {
      if (words[i] !== compareWords[i]) {
        result.push(words[i]);
      }
    }
    return result;
  }, [isMatch, text, textCompare]);

  const highlightedText = (
    <Highlighter
      className={cn('break-word-mt block')}
      highlightClassName="text-error underline bg-transparent"
      searchWords={diffWords}
      autoEscape={true}
      textToHighlight={text}
      unhighlightClassName={cn('', isMatch ? 'text-success' : '')}
    />
  );

  useKeyboardShortcut(
    [SHORTCUTS.EDIT_ESL_TRANSLATION, SHORTCUTS.CONFIRM_ESL_TRANSLATED],
    (_, matched) => {
      if (isEqual(matched, SHORTCUTS.EDIT_ESL_TRANSLATION)) {
        editUnMatch();
        return;
      }
      if (isEqual(matched, SHORTCUTS.CONFIRM_ESL_TRANSLATED)) {
        acceptUnMatch();
        return;
      }
    },
  );

  return (
    <div className="relative rounded-[8px] bg-background-darker dark:bg-neutral-800 p-3">
      <div className="flex">
        <CircleFlag
          className="countryCircleIcon mr-2"
          countryCode={'uk'}
          height="35"
        />
        <div className="flex-1 overflow-hidden">{highlightedText}</div>
      </div>
      <div className="mt-2 flex justify-end">
        {type === 'edit' ? (
          <Button.Icon
            variant="ghost"
            color="default"
            size="xs"
            onClick={editUnMatch}
          >
            <Edit2Icon />
          </Button.Icon>
        ) : (
          <>
            {!isMatch && !isEdit && (
              <Button.Icon size="xs" color="success" onClick={acceptUnMatch}>
                <CheckCircle2Icon />
              </Button.Icon>
            )}
          </>
        )}
      </div>
    </div>
  );
};
