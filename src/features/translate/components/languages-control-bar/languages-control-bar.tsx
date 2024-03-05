'use client';

import { ArrowRightLeftIcon } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/actions';
import { BackLayout } from '@/components/layout/back-layout';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useSetParams } from '@/hooks/use-set-params';
import { useTranslateStore } from '@/stores/translate.store';
import { cn } from '@/utils/cn';
import { LanguageSelect } from '../language-select';
import { ListLanguages } from '../list-languages';
import { useLanguageStore } from '../../stores/language.store';
import { useAppStore } from '@/stores/app.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import SpeechRecognition from 'react-speech-recognition';

const MAX_SELECTED_LANGUAGES = 3;

export interface LanguagesControlBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  source?: string;
  target?: string;
  detect?: string;
  targetResult?: string;
}

export const LanguagesControlBar = forwardRef<
  HTMLDivElement,
  LanguagesControlBarProps
>(
  (
    { targetResult, source: _source, target: _target, detect, ...props },
    ref,
  ) => {
    const [currentSelect, setCurrentSelect] = useState<
      'source' | 'target' | 'none'
    >('none');
    const { searchParams, setParams } = useSetParams();
    const { setValue, isListening } = useTranslateStore();
    const source = searchParams?.get('source');
    const target = searchParams?.get('target') || DEFAULT_LANGUAGES_CODE.EN;
    const isTablet = useAppStore((state) => state.isTablet);
    const [isHydrated, setIsHydrated] = useState(false);
    const {
      recentlySourceUsed,
      recentlyTargetUsed,
      addRecentlyUsed,
      lastSourceUsed,
      lastTargetUsed,
    } = useLanguageStore();

    const [clickable, setClickable] = useState(true);

    const handleSwapLanguage = useCallback(() => {
      if (!clickable || !_target) return;
      const sourceValue =
        _source || recentlyTargetUsed.filter((item) => item !== _target)[0];
      const newParams = [
        { key: 'source', value: _target },
        {
          key: 'target',
          value: sourceValue,
        },
      ];

      addRecentlyUsed(_target, 'source');
      addRecentlyUsed(sourceValue, 'target');
      if (isListening) {
        setValue('');
        SpeechRecognition.stopListening();
        setParams(newParams);
        return;
      }
      if (targetResult) {
        setClickable(false);
        setTimeout(() => {
          setValue(targetResult);
          setClickable(true);
        }, 500); // delay to prevent flickering
        newParams.push({ key: 'query', value: targetResult });
      }

      setParams(newParams);
    }, [
      _source,
      _target,
      addRecentlyUsed,
      clickable,
      isListening,
      recentlyTargetUsed,
      setParams,
      setValue,
      targetResult,
    ]);
    useKeyboardShortcut([SHORTCUTS.SWAP_LANGUAGES], handleSwapLanguage);

    const handleSelect = (code: string, type: 'source' | 'target') => {
      setCurrentSelect('none');
      const sourceValue = searchParams?.get('source');
      const targetValue =
        searchParams?.get('target') || DEFAULT_LANGUAGES_CODE.EN;

      if (type === 'source') {
        if (code === targetValue) {
          handleSwapLanguage();
          return;
        }
        setParams([{ key: 'source', value: code }]);
        addRecentlyUsed(code, type);
      } else {
        if (code === sourceValue) {
          handleSwapLanguage();
          return;
        }
        setParams([{ key: 'target', value: code }]);
        addRecentlyUsed(code, type);
      }
      if (isListening) {
        setValue('');
        SpeechRecognition.stopListening();
      }
    };

    useEffect(() => {
      useLanguageStore.persist.rehydrate();
      setIsHydrated(true);
    }, []);

    useEffect(() => {
      if (!isHydrated) return;
      const newParams = [];
      if (!searchParams?.get('source')) {
        newParams.push({
          key: 'source',
          value: lastSourceUsed,
        });
      }
      if (!searchParams?.get('target')) {
        newParams.push({
          key: 'target',
          value: lastTargetUsed,
        });
      }

      if (detect) {
        newParams.push({
          key: 'detect',
          value: detect,
        });
      }

      if (newParams.length > 0) {
        setParams(newParams);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, detect, isHydrated]);

    return (
      <>
        <div
          ref={ref}
          {...props}
          className={cn(
            'flex w-full items-center justify-center gap-5 md:gap-0',
            props.className,
          )}
        >
          <div className="flex flex-1 justify-end rounded-2xl lg:justify-start lg:overflow-hidden">
            <LanguageSelect
              onChevronClick={() => {
                setCurrentSelect('source');
              }}
              languageCodes={
                recentlySourceUsed?.slice(0, MAX_SELECTED_LANGUAGES) || []
              }
              currentCode={source || 'auto'}
              onChange={(code) => {
                if (isTablet) {
                  setCurrentSelect('source');
                  return;
                }
                handleSelect(code, 'source');
              }}
            />
          </div>

          <div className="flex w-5 items-center justify-center md:w-[88px]">
            <Button.Icon
              size="xs"
              className="shrink-0"
              disabled={source === 'auto'}
              onClick={handleSwapLanguage}
              variant="ghost"
              color="default"
            >
              <ArrowRightLeftIcon className="text-text" />
            </Button.Icon>
          </div>
          <div className="flex flex-1 justify-start rounded-2xl lg:overflow-hidden">
            <LanguageSelect
              onChange={(code) => {
                if (isTablet) {
                  setCurrentSelect('target');
                  return;
                }
                handleSelect(code, 'target');
              }}
              languageCodes={
                recentlyTargetUsed?.slice(0, MAX_SELECTED_LANGUAGES) || []
              }
              onChevronClick={() => {
                setCurrentSelect('target');
              }}
              currentCode={target}
            />
          </div>
        </div>
        {currentSelect !== 'none' && (
          <div className="fixed left-0 top-[72px] z-20 h-full w-full bg-background">
            <BackLayout
              title="Select language"
              onBack={() => {
                setCurrentSelect('none');
              }}
            >
              <ListLanguages
                type={currentSelect}
                allowDetect={currentSelect === 'source'}
                onSelected={
                  currentSelect === 'source'
                    ? (code) => {
                        handleSelect(code, 'source');
                      }
                    : (code) => {
                        handleSelect(code, 'target');
                      }
                }
                selectedCode={searchParams?.get(currentSelect) as string}
              />
            </BackLayout>
          </div>
        )}
      </>
    );
  },
);
LanguagesControlBar.displayName = 'LanguagesControlBar';
