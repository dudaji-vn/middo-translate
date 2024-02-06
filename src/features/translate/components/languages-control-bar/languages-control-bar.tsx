'use client';

import { ArrowRightLeftIcon } from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';

import { Button } from '@/components/actions';
import { BackLayout } from '@/components/layout/back-layout';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useSetParams } from '@/hooks/use-set-params';
import { useTranslateStore } from '@/stores/translate.store';
import { cn } from '@/utils/cn';
import { LanguageSelect } from '../language-select';
import { ListLanguages } from '../list-languages';
import { useLanguageStore } from '../../stores/language.store';

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
    const { setValue } = useTranslateStore();
    const source = searchParams?.get('source');
    const target = searchParams?.get('target') || DEFAULT_LANGUAGES_CODE.EN;
    const { recentlySourceUsed, recentlyTargetUsed, addRecentlyUsed } =
      useLanguageStore();

    const [canClick, setCanClick] = useState(true);

    const handleSwap = () => {
      if (!canClick) return;
      if (!_source || !_target) return;
      const newParams = [
        {
          key: 'source',
          value: _target,
        },
        {
          key: 'target',
          value: _source,
        },
      ];
      addRecentlyUsed(_target, 'source');
      addRecentlyUsed(_source, 'target');
      if (targetResult) {
        setCanClick(false);
        setTimeout(() => {
          setValue(targetResult);
          setCanClick(true);
        }, 500);
        newParams.push({
          key: 'query',
          value: targetResult,
        });
      }
      setParams(newParams);
    };

    const handleSelect = (code: string, type: 'source' | 'target') => {
      setCurrentSelect('none');
      if (type === 'source') {
        if (code === searchParams?.get('source')) {
          handleSwap();
          return;
        }
        setParams([
          {
            key: 'source',
            value: code,
          },
        ]);
        addRecentlyUsed(code, type);
        return;
      }
      if (code === searchParams?.get('source')) {
        handleSwap();
        return;
      }
      setParams([
        {
          key: 'target',
          value: code,
        },
      ]);
      addRecentlyUsed(code, type);
    };

    useEffect(() => {
      const newParams = [];
      if (!searchParams?.get('source')) {
        newParams.push({
          key: 'source',
          value: recentlySourceUsed[0] || 'auto',
        });
      }
      if (!searchParams?.get('target')) {
        newParams.push({
          key: 'target',
          value: recentlyTargetUsed[0] || DEFAULT_LANGUAGES_CODE.EN,
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
    }, [searchParams, detect]);

    return (
      <>
        <div
          ref={ref}
          {...props}
          className={cn(
            'flex w-full items-center justify-center gap-5',
            props.className,
          )}
        >
          <div className="flex flex-1 justify-end md:justify-start">
            <LanguageSelect
              firstCode="auto"
              onChevronClick={() => {
                setCurrentSelect('source');
              }}
              secondaryCode={
                recentlySourceUsed[0] === 'auto' ? 'vi' : recentlySourceUsed[0]
              }
              currentCode={source || 'auto'}
              onChange={(code) => {
                handleSelect(code, 'source');
              }}
            />
          </div>

          <Button.Icon
            size="xs"
            onClick={handleSwap}
            variant="ghost"
            color="default"
          >
            <ArrowRightLeftIcon className="text-text" />
          </Button.Icon>
          <div className="flex flex-1 justify-start">
            <LanguageSelect
              onChange={(code) => {
                handleSelect(code, 'target');
              }}
              firstCode="en"
              secondaryCode={
                recentlyTargetUsed[0] === 'en' ? 'ko' : recentlyTargetUsed[0]
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
