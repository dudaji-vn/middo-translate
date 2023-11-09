'use client';

import { forwardRef, useEffect } from 'react';

import { useTranslateStore } from '@/stores/translate';

export interface DetectTranslateWayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sourceLanguage?: string;
  targetLanguage?: string;
}

export const DetectTranslateWay = forwardRef<
  HTMLDivElement,
  DetectTranslateWayProps
>((props, ref) => {
  const { setIsEnglishTranslate } = useTranslateStore();
  useEffect(() => {
    if (props.sourceLanguage === 'en' || props.targetLanguage === 'en') {
      setIsEnglishTranslate(true);
    } else {
      setIsEnglishTranslate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sourceLanguage, props.targetLanguage]);
  return <></>;
});
DetectTranslateWay.displayName = 'DetectTranslateWay';
