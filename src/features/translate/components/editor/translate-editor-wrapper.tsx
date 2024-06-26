'use client';

import './style.css';

import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';

import { CircleFlag } from 'react-circle-flags';
import { Globe2Icon } from 'lucide-react';
import { Triangle } from '@/components/icons';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app.store';

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
  footerElement?: React.ReactNode;
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
  footerElement,
}: TranslateEditorWrapperProps) => {
  const language = getLanguageByCode(languageCode);
  const theme = useAppStore((state) => state.theme);
  const {t} = useTranslation('common');
  return (
    <div
      className={cn(
        'translateTextWrapper relative transition-all md:min-h-[320px]',
        type,
        status,
        className,
      )}
    >
      {!!topElement && (
        <div className="relative mb-4">
          <Triangle
            position="bottom"
            className="absolute bottom-0 left-3 translate-y-full"
          />
          {topElement}
        </div>
      )}
      <div className="detectLanguageWrapper">
        {language && !isDetect ? (
          <div className="size-5 overflow-hidden rounded-full">
            <CircleFlag
              className="countryCircleIcon"
              countryCode={getCountryCode(language.code) as string}
              height="35"
            />
          </div>
        ) : (
          <Globe2Icon className="countryCircleIcon font-light text-primary" />
        )}
        <div className="opacity-40">
          {prefixLanguage && <span>{prefixLanguage} - </span>}
          {language?.name ? (
            <span>
              {isDetect ? `${t('LANGUAGE.Detected')}: ${t('LANGUAGE.' + language.name)}` : t('LANGUAGE.' + language.name)}
            </span>
          ) : (
            <span>{t('LANGUAGE.DETECT_LANGUAGE')}</span>
          )}
        </div>
      </div>
      {children}
      {!!bottomElement && (
        <div className="relative mt-4">
          <Triangle
            position="top"
            className="absolute left-3 top-0 -translate-y-full"
            {...theme == 'dark' && {...{fill: '#333'}}}
          />
          {bottomElement}
        </div>
      )}
      {!!footerElement && (
        <div className="bottom-0 left-0 mt-auto w-full">{footerElement}</div>
      )}
    </div>
  );
};
