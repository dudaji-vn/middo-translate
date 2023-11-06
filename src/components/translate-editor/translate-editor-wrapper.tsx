'use client';

import './style.css';

import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';

import { CircleFlag } from 'react-circle-flags';
import { Globe2Outline } from '@easy-eva-icons/react';
import { cn } from '@/utils/cn';

export interface TranslateEditorWrapperProps {
  prefixLanguage?: string;
  className?: string;
  languageCode?: string;
  children?: React.ReactNode;
  type?: 'default' | 'middle' | 'result';
  status?: 'default' | 'correct' | 'error';
}

export const TranslateEditorWrapper = ({
  prefixLanguage,
  className,
  languageCode = 'auto',
  children,
  type = 'default',
  status = 'default',
}: TranslateEditorWrapperProps) => {
  const language = getLanguageByCode(languageCode);
  return (
    <div
      className={cn(
        'translateTextWrapper relative transition-all',
        type,
        status,
        className,
      )}
    >
      <div className="detectLanguageWrapper">
        {language ? (
          <CircleFlag
            className="countryCircleIcon"
            countryCode={getCountryCode(language.code) as string}
            height="35"
          />
        ) : (
          <Globe2Outline className="countryCircleIcon font-light text-primary" />
        )}
        <div className="opacity-40">
          {prefixLanguage && <span>{prefixLanguage} - </span>}
          {language?.name || 'Detect language'}
        </div>
      </div>
      {children}
    </div>
  );
};
