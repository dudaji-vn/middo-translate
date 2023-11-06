'use client';

import './style.css';

import { ChangeEvent, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { CloseCircleOutline } from '@easy-eva-icons/react';
import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { cn } from '@/utils/cn';
import { detectLanguage } from '@/services/languages';
import { useAdjustTextStyle } from '@/hooks/use-adjust-text-style';
import { useDebounce } from 'usehooks-ts';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';

export interface TranslateEditorProps {
  className?: string;
  languageCode?: string;
  disabled?: boolean;
  sourceTranslateResult?: string;
  isDetect?: boolean;
}

export const TranslateEditor = ({
  className,
  languageCode = 'auto',
  disabled = false,
  sourceTranslateResult,
  isDetect = false,
}: TranslateEditorProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const text = searchParams.get('query') || '';
  const [value, setValue] = useState<string>(text);
  const textStyles = useAdjustTextStyle(value);
  const debouncedValue = useDebounce<string>(value, 300);
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (
      !isFocus ||
      (debouncedValue && debouncedValue === sourceTranslateResult)
    ) {
      return;
    }

    if (debouncedValue) {
      params.set('query', debouncedValue);
      params.delete('edit');
      params.delete('mquery');
      if (!languageCode || languageCode === 'auto') {
        detectLanguage(debouncedValue).then((res) => {
          params.set('source', res);

          replace(`${pathname}?${params.toString()}`);
        });
      }
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
  }, [sourceTranslateResult, text]);

  return (
    <TranslateEditorWrapper
      isDetect={isDetect}
      languageCode={languageCode}
      type={disabled ? 'result' : 'default'}
      className={className}
    >
      {value && (
        <button
          onClick={() => {
            setValue('');
          }}
          className="btn-icon absolute right-3 top-3"
        >
          <CloseCircleOutline className="h-6 w-6 opacity-60" />
        </button>
      )}
      <textarea
        rows={1}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        disabled={disabled}
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        className={cn('inputTranslate transition-all', textStyles)}
        placeholder="Input your text here"
      />
    </TranslateEditorWrapper>
  );
};
