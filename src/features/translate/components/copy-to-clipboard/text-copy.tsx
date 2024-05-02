'use client';

import { Button } from '@/components/actions';
import { useCompare } from '@/features/translate/context';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useTextCopy } from '@/hooks/use-text-copy';
import { useTranslateStore } from '@/stores/translate.store';
import { SHORTCUTS } from '@/types/shortcuts';
import { getFlagEmoji } from '@/utils/get-flag-emoji';
import { getCountryCode } from '@/utils/language-fn';
import { Layers3Icon } from 'lucide-react';
import { forwardRef } from 'react';

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
    useKeyboardShortcut([SHORTCUTS.COPY_ALL_TEXT], () => {
      if (isMatch && !isEnglishTranslate) {
        handleCopy();
      }
    });
    if (!sourceText) return null;

    return (
      <div ref={ref} {...props}>
        <Button.Icon
          disabled={!isMatch || isEnglishTranslate}
          onClick={handleCopy}
          variant="default"
          color="secondary"
          size="sm"
        >
          <Layers3Icon />
        </Button.Icon>
      </div>
    );
  },
);
TextCopy.displayName = 'TextCopy';
