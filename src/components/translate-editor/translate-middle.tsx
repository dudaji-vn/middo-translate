'use client';

import './style.css';

import { CircleFlag } from 'react-circle-flags';
import Highlighter from 'react-highlight-words';
import { Triangle } from '../icons';
import { cn } from '@/utils/cn';

export interface TranslateMiddleProps {
  text: string;
  textCompare: string;
  trianglePosition?: 'top' | 'bottom';
}

export const TranslateMiddle = ({
  text,
  trianglePosition = 'top',
  textCompare,
}: TranslateMiddleProps) => {
  const words = text.toLocaleLowerCase().split(' ');
  const compareWords = textCompare.toLocaleLowerCase().split(' ');
  const diffWords = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] !== compareWords[i]) {
      diffWords.push(words[i]);
    }
  }

  const highlightedText = (
    <Highlighter
      highlightClassName="text-error underline bg-transparent"
      searchWords={diffWords}
      autoEscape={true}
      textToHighlight={text}
    />
  );

  return (
    <div className="relative flex break-all rounded-[8px] bg-background-darker p-2.5">
      <CircleFlag
        className="countryCircleIcon mr-2"
        countryCode={'uk'}
        height="35"
      />
      <p>{highlightedText}</p>
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
