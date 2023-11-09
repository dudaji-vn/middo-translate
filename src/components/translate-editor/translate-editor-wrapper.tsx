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
  isDetect?: boolean;
  topElement?: React.ReactNode;
  bottomElement?: React.ReactNode;
}

export const TranslateEditorWrapper = ({
  prefixLanguage,
  className,
  languageCode = 'auto',
  children,
  type = 'default',
  status = 'default',
  isDetect = false,
  topElement,
  bottomElement,
}: TranslateEditorWrapperProps) => {
  console.log('languageCode', languageCode);
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
      {topElement && <div className="mb-4">{topElement}</div>}
      <div className="detectLanguageWrapper">
        {language && !isDetect ? (
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
          {language?.name ? (
            <span>
              {isDetect ? `Detected: ${language.name}` : language.name}
            </span>
          ) : (
            <span>Detect language</span>
          )}
        </div>
      </div>
      {children}
      {bottomElement && <div className="mt-2">{bottomElement}</div>}
    </div>
  );
};
