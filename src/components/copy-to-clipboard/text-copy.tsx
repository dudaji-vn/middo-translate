'use client';

import { CopyOutline } from '@easy-eva-icons/react';
import { IconButton } from '../button';
import { forwardRef } from 'react';
import { getCountryCode } from '@/utils/language-fn';
import { useToast } from '../toast';

export interface TextCopyProps extends React.HTMLAttributes<HTMLDivElement> {
  sourceText: string;
  targetText: string;
  sourceEnglishText: string;
  targetEnglishText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export const TextCopy = forwardRef<HTMLDivElement, TextCopyProps>(
  (
    {
      sourceEnglishText,
      sourceText,
      targetEnglishText,
      targetText,
      sourceLanguage,
      targetLanguage,
      ...props
    },
    ref,
  ) => {
    const { toast } = useToast();
    const handleCopy = () => {
      const firstLine = `${getFlagEmoji(
        getCountryCode(sourceLanguage) as string,
      )} ${sourceText}`;
      const secondLine = `${getFlagEmoji('gb')} ${targetEnglishText}`;
      const thirdLine = `${getFlagEmoji(
        getCountryCode(targetLanguage) as string,
      )} ${targetText}`;
      const textFormat = `${firstLine}\n${secondLine}\n${thirdLine}`;
      navigator.clipboard.writeText(textFormat);
      toast({ title: 'Copied!' });
    };
    return (
      <div ref={ref} {...props}>
        <IconButton onClick={handleCopy} variant="ghostPrimary">
          <CopyOutline className="h-7 w-7" />
        </IconButton>
      </div>
    );
  },
);
TextCopy.displayName = 'TextCopy';

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
