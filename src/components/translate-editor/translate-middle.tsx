'use client';

import './style.css';

import { CheckmarkCircle2Outline, Edit2Outline } from '@easy-eva-icons/react';
import {
  addAcceptDiffResult,
  getAcceptDiffResult,
} from '@/utils/local-storage';
import { useEffect, useMemo, useState } from 'react';

import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { cn } from '@/utils/cn';
import { useAdjustTextStyle } from '@/hooks/use-adjust-text-style';
import { useSetParams } from '@/hooks/use-set-params';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';

export interface TranslateMiddleProps {
  result: string;
  targetResult: string;
}

export const TranslateMiddle = ({
  result,
  targetResult,
}: TranslateMiddleProps) => {
  const [value, setValue] = useState('');
  const { searchParams, setParams } = useSetParams();
  const { textAreaRef } = useTextAreaResize(value);
  const textStyles = useAdjustTextStyle(value);
  const [acceptList, setAcceptList] = useState<Record<string, string>>({});

  const isEdit = searchParams.get('edit') === 'true';

  const isError = useMemo(() => {
    if (!acceptList[result]) return false;
    return result !== targetResult;
  }, [acceptList, result, targetResult]);

  const handleClickEdit = () => {
    setValue(result);
    setParams([
      {
        key: 'edit',
        value: 'true',
      },
    ]);
  };

  const handleDone = () => {
    const newParams = [
      {
        key: 'edit',
        value: 'false',
      },
      {
        key: 'query',
        value: '',
      },
    ];
    if (value && value !== result) {
      newParams.push({
        key: 'mquery',
        value,
      });
    }
    setParams(newParams);
  };

  const handleAccept = () => {
    addAcceptDiffResult(result, targetResult);
    setAcceptList((prev) => ({
      ...prev,
      [result]: targetResult,
    }));
  };

  useEffect(() => {
    setAcceptList(getAcceptDiffResult());
  }, []);

  useEffect(() => {
    const translateResultTextEl = document.querySelector('.bottomResultText');
    if (isError) {
      translateResultTextEl?.classList.add('error');
      translateResultTextEl?.classList.remove('correct');
    } else {
      translateResultTextEl?.classList.remove('error');
      translateResultTextEl?.classList.add('correct');
    }
  }, [isError]);

  return (
    <TranslateEditorWrapper
      prefixLanguage="Middle language"
      type={isEdit ? 'default' : 'middle'}
      status={isEdit ? 'default' : isError ? 'error' : 'correct'}
      languageCode={DEFAULT_LANGUAGES_CODE.EN}
    >
      {!isEdit && (
        <p className={cn('translateResultText break-words', textStyles)}>
          {result}
        </p>
      )}
      {isEdit && (
        <textarea
          value={value}
          ref={textAreaRef}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className={cn('inputTranslate  bg-transparent', textStyles)}
          placeholder="hello"
        />
      )}
      {isError && !isEdit && (
        <div className="mt-6 flex justify-between">
          <button onClick={handleAccept} className="smallButton ">
            <CheckmarkCircle2Outline className="h-7 w-7 " />
            <div className="buttonText">I think it&apos;s OK</div>
          </button>
          <button
            onClick={handleClickEdit}
            className="smallButton !border-none !bg-background !text-text"
          >
            <Edit2Outline className="h-7 w-7 " />
            <div className="buttonText">Edit</div>
          </button>
        </div>
      )}
      {isEdit && (
        <button onClick={handleDone} className="smallButton ml-auto">
          <CheckmarkCircle2Outline className="h-7 w-7 " />
          <div className="buttonText">Done</div>
        </button>
      )}
    </TranslateEditorWrapper>
  );
};
