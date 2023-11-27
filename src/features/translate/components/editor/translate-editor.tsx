'use client';

import './style.css';

import { ChangeEvent, useEffect } from 'react';
import {
  CloseCircleOutline,
  CopyOutline,
  VolumeUpOutline,
} from '@easy-eva-icons/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { CopyZoneClick } from '@/components/copy-zone-click';
import { IconButton } from '@/components/button';
import { TranslateEditorWrapper } from '@/features/translate/components/editor/translate-editor-wrapper';
import { cn } from '@/utils/cn';
import { useAdjustTextStyle } from '@/hooks/use-adjust-text-style';
import { useDebounce } from 'usehooks-ts';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { useTranslateStore } from '@/stores/translate';

export interface TranslateEditorProps {
  className?: string;
  languageCode?: string;
  disabled?: boolean;
  sourceTranslateResult?: string;
  isDetect?: boolean;
  children?: React.ReactNode;
}

export const TranslateEditor = ({
  sourceTranslateResult,
  languageCode = 'auto',
  disabled = false,
  isDetect = false,
  className,
  children,
}: TranslateEditorProps) => {
  const searchParams = useSearchParams();
  const text = searchParams.get('query') || '';
  const {
    value,
    setValue,
    isListening,
    isFocused,
    setIsFocused,
    setIsListening,
    setIsLoading,
    setTextStyle,
  } = useTranslateStore();
  const textStyles = useAdjustTextStyle(value);

  useEffect(() => {
    setTextStyle(textStyles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textStyles]);
  const debouncedValue = useDebounce<string>(value, 300);
  const pathname = usePathname();
  const { replace } = useRouter();

  const { speak } = useTextToSpeech(languageCode, value);

  const isKeyboardOpen = useDetectKeyboardOpen();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };
  useEffect(() => {
    if (isListening) {
      return;
    } else if (
      (!isFocused && isListening) ||
      (debouncedValue && debouncedValue === sourceTranslateResult)
    ) {
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (!params.get('source')) return;
    if (debouncedValue) {
      params.set('query', debouncedValue);
      params.delete('edit');
      params.delete('mquery');
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, isFocused, isListening]);

  const { textAreaRef } = useTextAreaResize(value);

  useEffect(() => {
    if (sourceTranslateResult && !text) {
      setValue(sourceTranslateResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceTranslateResult, text]);

  useEffect(() => {
    if (!isKeyboardOpen) {
      setIsFocused(false);
      textAreaRef.current?.blur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeyboardOpen]);

  useEffect(() => {
    setValue(text);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClear = () => {
    setValue('');
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    params.delete('edit');
    params.delete('mquery');
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TranslateEditorWrapper
      bottomElement={children}
      isDetect={isDetect}
      languageCode={languageCode}
      type={disabled ? 'result' : 'default'}
      className={className}
      footerElement={
        <div className="bottom-3 right-3 mt-3 flex justify-end">
          <IconButton
            onClick={() => {
              speak();
            }}
            disabled={!value}
            variant="ghostPrimary"
          >
            <VolumeUpOutline />
          </IconButton>
          <CopyZoneClick text={value}>
            <IconButton disabled={!value} variant="ghostPrimary">
              <CopyOutline />
            </IconButton>
          </CopyZoneClick>
        </div>
      }
    >
      {value && !disabled && (
        <IconButton
          onClick={handleClear}
          variant="ghost"
          className="btn-icon absolute right-3 top-3"
        >
          <CloseCircleOutline className="h-6 w-6 opacity-60" />
        </IconButton>
      )}
      <textarea
        rows={1}
        onFocus={() => {
          setIsFocused(true);
          setIsListening(false);
        }}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        className={cn(
          'inputTranslate translate-editor h-full   bg-transparent',
          textStyles,
          !value && 'flex-1',
        )}
        placeholder={isListening ? 'Please speak' : 'Input your text here'}
      />
    </TranslateEditorWrapper>
  );
};
