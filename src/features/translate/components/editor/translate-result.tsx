'use client';

import { CopyIcon, Volume2Icon } from 'lucide-react';

import { Button } from '@/components/actions';
import { CopyZoneClick } from '@/components/actions';
import React from 'react';
import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { useTranslateStore } from '@/stores/translate.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { useTextCopy } from '@/hooks/use-text-copy';

export interface TranslateResultProps {
  result: string;
  languageCode?: string;
  children?: React.ReactNode;
  hasResult?: boolean;
}

export const TranslateResult = ({
  result,
  languageCode,
  children,
}: TranslateResultProps) => {
  const { textStyle } = useTranslateStore();

  const { speak } = useTextToSpeech(languageCode, result);
  const isMobile = useAppStore((state) => state.isMobile);
  const array = result.split('\n');
  const { copy } = useTextCopy(result);
  useKeyboardShortcut([SHORTCUTS.TRANSLATED_COPY], () => {
    copy();
  });
  return (
    <TranslateEditorWrapper
      className={cn(
        'flex flex-col md:flex-1',
        !!result ? 'flex' : 'hidden md:flex',
      )}
      type="result"
      topElement={isMobile && children}
      bottomElement={!isMobile && children}
      languageCode={languageCode}
      footerElement={
        <div className="bottom-3 right-3 mt-3 flex justify-end gap-2">
          <Button.Icon
            disabled={!result}
            onClick={() => speak()}
            variant="ghost"
            color="primary"
            size="xs"
          >
            <Volume2Icon />
          </Button.Icon>
          <CopyZoneClick text={result}>
            <Button.Icon
              disabled={!result}
              variant="ghost"
              color="primary"
              size="xs"
            >
              <CopyIcon />
            </Button.Icon>
          </CopyZoneClick>
        </div>
      }
    >
      <div
        className={`translatedText ${textStyle}`}
        style={{ wordBreak: 'break-word' }}
      >
        {array.map((item, index) => (
          <span className={`translatedText ${textStyle}`} key={index}>
            {item}
            <br />
          </span>
        ))}
      </div>
    </TranslateEditorWrapper>
  );
};
