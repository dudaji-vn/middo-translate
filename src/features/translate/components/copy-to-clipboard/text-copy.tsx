'use client';

import { Button } from '@/components/actions';
import { MultipleCopyIcon } from '@/components/icons';
import { forwardRef } from 'react';
import { getCountryCode } from '@/utils/language-fn';
import { useCompare } from '@/features/translate/context';
import { useTextCopy } from '@/hooks/use-text-copy';
import { useTranslateStore } from '@/stores/translate';

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
    const { copy } = useTextCopy();
    const { isEnglishTranslate } = useTranslateStore();
    const { isMatch } = useCompare();
    const handleCopy = () => {
      const firstLine = `${getFlagEmoji(
        getCountryCode(sourceLanguage) as string,
      )} ${sourceText}`;
      const secondLine = `${getFlagEmoji('gb')} ${targetEnglishText}`;
      const thirdLine = `${getFlagEmoji(
        getCountryCode(targetLanguage) as string,
      )} ${targetText}`;
      const textFormat = `${firstLine}\n${secondLine}\n${thirdLine}`;
      copy(textFormat);
    };

    if (!sourceText) return null;

    return (
      <div ref={ref} {...props}>
        <Button.Icon
          disabled={!isMatch || isEnglishTranslate}
          onClick={handleCopy}
          variant="ghost"
          color="primary"
          size="lg"
        >
          <MultipleCopyIcon />
        </Button.Icon>
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
