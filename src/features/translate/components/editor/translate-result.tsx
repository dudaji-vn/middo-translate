'use client';

import { CopyIcon } from 'lucide-react';

import { Button } from '@/components/actions';
import { CopyZoneClick } from '@/components/actions';
import React, { useEffect } from 'react';
import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { useTranslateStore } from '@/stores/translate.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { useTextCopy } from '@/hooks/use-text-copy';
import { THistoryItem } from '@/app/(main-layout)/_components/history/history';
import { useHistoryStore } from '../../stores/history.store';
import { isEmpty } from 'lodash';
import { useDebounce } from 'usehooks-ts';
import { TextToSpeechButton } from '../text-to-speech-button';
import { useCompare } from '../../context';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
export interface TranslateResultProps {
  result: string;
  languageCode?: string;
  children?: React.ReactNode;
  hasResult?: boolean;
  historyItem: THistoryItem;
}

export const TranslateResult = ({
  result,
  languageCode,
  historyItem,
  children,
}: TranslateResultProps) => {
  const { textStyle } = useTranslateStore();

  const isMobile = useAppStore((state) => state.isMobile);
  const array = result.split('\n');
  const { isMatch } = useCompare();
  const { copy } = useTextCopy(result);
  useKeyboardShortcut([SHORTCUTS.TRANSLATED_COPY], () => {
    copy();
  });
  const {pushWithNoDuplicate} = useHistoryStore();

  const debouncedSavedResult = useDebounce<string>(result, 1000);
  const debounedMatched = useDebounce<boolean>(isMatch, 1000);
  
  useEffect(() => {
    if (
      !isEmpty(historyItem) &&
      debouncedSavedResult &&
      (debounedMatched ||
        historyItem.dest.language === DEFAULT_LANGUAGES_CODE.EN ||
        historyItem.dest.language === DEFAULT_LANGUAGES_CODE.EN)
    ) {
      pushWithNoDuplicate({
        ...historyItem,
        dest: {
          ...historyItem.dest,
          content: debouncedSavedResult,
        },
        id: new Date().getTime().toString(),
      });
    }
  }, [debouncedSavedResult, debounedMatched]);

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
          <TextToSpeechButton
            languageCode={languageCode}
            text={result}
            shortcut={SHORTCUTS.TRANSLATED_TEXT_TO_SPEECH}
          />
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
