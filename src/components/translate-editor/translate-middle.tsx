'use client';

import './style.css';

import { AcceptButton } from './accept-button';
import { CircleFlag } from 'react-circle-flags';
import { EditButton } from './edit-button';
import Highlighter from 'react-highlight-words';
import { Triangle } from '../icons';
import { cn } from '@/utils/cn';
import { useCompare } from '../compare';
import { useMemo } from 'react';

export interface TranslateMiddleProps {
  text: string;
  textCompare: string;
  trianglePosition?: 'top' | 'bottom';
  children?: React.ReactNode;
  type?: 'edit' | 'accept';
  isEdit?: boolean;
}

export const TranslateMiddle = ({
  text,
  trianglePosition = 'top',
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
      highlightClassName="text-error underline bg-transparent"
      searchWords={diffWords}
      autoEscape={true}
      textToHighlight={text}
    />
  );

  return (
    <div className="relative rounded-[8px] bg-background-darker p-2.5">
      <div className="flex">
        <CircleFlag
          className="countryCircleIcon mr-2"
          countryCode={'uk'}
          height="35"
        />
        <p className="break-all">{highlightedText}</p>
      </div>
      {!isMatch && !isEdit && (
        <div className="flex justify-end">
          {type === 'edit' ? (
            <EditButton onClick={editUnMatch} />
          ) : (
            <AcceptButton onClick={acceptUnMatch} />
          )}
        </div>
      )}
      <Triangle
        position={trianglePosition}
        className={cn(
          'absolute left-3 ',
          trianglePosition === 'bottom'
            ? 'bottom-0 translate-y-full'
            : 'top-0 -translate-y-full',
        )}
      />
    </div>
  );
};
