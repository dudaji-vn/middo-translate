'use client';

import './style.css';

import { CheckmarkCircle2Outline, Edit2Outline } from '@easy-eva-icons/react';

import { Button } from '@/components/actions';
import { CircleFlag } from 'react-circle-flags';
import Highlighter from 'react-highlight-words';
import { cn } from '@/utils/cn';
import { useCompare } from '@/features/translate/context/compare';
import { useMemo } from 'react';

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

  return (
    <div className="relative rounded-[8px] bg-background-darker p-3">
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
          <Button.Icon variant="ghost" color="default" onClick={editUnMatch}>
            <Edit2Outline />
          </Button.Icon>
        ) : (
          <>
            {!isMatch && !isEdit && (
              <Button.Icon color="success" onClick={acceptUnMatch}>
                <CheckmarkCircle2Outline />
              </Button.Icon>
            )}
          </>
        )}
      </div>
    </div>
  );
};
