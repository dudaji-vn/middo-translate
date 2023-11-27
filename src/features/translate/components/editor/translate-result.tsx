'use client';

import { CopyOutline, VolumeUpOutline } from '@easy-eva-icons/react';

import { CopyZoneClick } from '@/components/copy-zone-click';
import { IconButton } from '@/components/button';
import React from 'react';
import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { cn } from '@/utils/cn';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { useTranslateStore } from '@/stores/translate';

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
  const isMobile = useIsMobile();
  const array = result.split('\n');
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
        <div className="bottom-3 right-3 mt-3 flex justify-end">
          <IconButton
            disabled={!result}
            onClick={() => speak()}
            variant="ghostPrimary"
          >
            <VolumeUpOutline />
          </IconButton>
          <CopyZoneClick text={result}>
            <IconButton disabled={!result} variant="ghostPrimary">
              <CopyOutline />
            </IconButton>
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
