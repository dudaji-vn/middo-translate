'use client';

import './style.css';

import { Button, IconButton } from '../button';
import { ChangeEvent, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { CloseCircleOutline } from '@easy-eva-icons/react';
import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { cn } from '@/utils/cn';
import { useAdjustTextStyle } from '@/hooks/use-adjust-text-style';
import { useDebounce } from 'usehooks-ts';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';
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
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const text = searchParams.get('query') || '';
  const { value, setValue, isListening } = useTranslateStore();
  const textStyles = useAdjustTextStyle(value);
  const debouncedValue = useDebounce<string>(value, 300);
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (
      !isFocus ||
      (debouncedValue && debouncedValue === sourceTranslateResult)
    ) {
      return;
    }
    const params = new URLSearchParams(searchParams);

    if (debouncedValue) {
      params.set('query', debouncedValue);
      params.delete('edit');
      params.delete('mquery');
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, isFocus]);

  const { textAreaRef } = useTextAreaResize(value);

  useEffect(() => {
    if (sourceTranslateResult && !text) {
      setValue(sourceTranslateResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceTranslateResult, text]);

  const handleClear = () => {
    setValue('');
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    params.delete('edit');
    params.delete('mquery');
    params.delete('listening');
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <TranslateEditorWrapper
      bottomElement={children}
      isDetect={isDetect}
      languageCode={languageCode}
      type={disabled ? 'result' : 'default'}
      className={className}
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
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        disabled={disabled}
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        className={cn(
          'inputTranslate translate-editor h-full bg-transparent transition-all',
          textStyles,
        )}
        placeholder={isListening ? 'Please speak' : 'Input your text here'}
      />
    </TranslateEditorWrapper>
  );
};
