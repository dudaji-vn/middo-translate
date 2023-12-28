'use client';

import { ArrowRightLeftIcon, Globe2Icon } from 'lucide-react';
import { Select, SelectTrigger } from '@/components/data-entry';
import { forwardRef, useEffect, useState } from 'react';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';

import { BackLayout } from '@/components/layout/back-layout';
import { Button } from '@/components/actions';
import { CircleFlag } from 'react-circle-flags';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { ListLanguages } from '../list-languages';
import { cn } from '@/utils/cn';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useSetParams } from '@/hooks/use-set-params';
import { useTranslateStore } from '@/stores/translate';

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
    const isMobile = useIsMobile();
    const [currentSelect, setCurrentSelect] = useState<
      'source' | 'target' | 'none'
    >('none');
    const { searchParams, setParams } = useSetParams();
    const { setValue } = useTranslateStore();
    const source = getCountryCode(searchParams?.get('source'), true);
    const target = getCountryCode(
      searchParams?.get('target') || DEFAULT_LANGUAGES_CODE.EN,
    );

    const [canClick, setCanClick] = useState(true);

    const handleSwap = () => {
      console.log(canClick);
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

    const handleSelect = (code: string) => {
      setCurrentSelect('none');
      if (currentSelect === 'source') {
        if (code === searchParams?.get('target')) {
          handleSwap();
          return;
        }
        setParams([
          {
            key: 'source',
            value: code,
          },
        ]);
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
    };

    useEffect(() => {
      const newParams = [];
      if (!searchParams?.get('source')) {
        newParams.push({
          key: 'source',
          value: 'auto',
        });
      }
      if (!searchParams?.get('target')) {
        newParams.push({
          key: 'target',
          value: DEFAULT_LANGUAGES_CODE.EN,
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
      <div
        ref={ref}
        {...props}
        className={cn('flex w-full justify-center gap-5', props.className)}
      >
        <div className="flex flex-1 justify-end">
          <Select>
            <SelectTrigger
              className="gap-2.5"
              onClick={() => {
                setCurrentSelect('source');
              }}
            >
              {source && source !== 'auto' ? (
                <>
                  <CircleFlag countryCode={source} height={20} width={20} />
                </>
              ) : (
                <>
                  <Globe2Icon className="h-5 w-5 text-primary" />
                  <>{!isMobile && 'Detect language'}</>
                </>
              )}
              {!isMobile &&
                getLanguageByCode(searchParams?.get('source') as string)?.name}
            </SelectTrigger>
          </Select>
        </div>

        <Button.Icon onClick={handleSwap} variant="ghost" color="default">
          <ArrowRightLeftIcon className="text-text" />
        </Button.Icon>
        <div className="flex flex-1 justify-start">
          <Select>
            <SelectTrigger
              className="gap-2.5"
              onClick={() => {
                setCurrentSelect('target');
              }}
            >
              <CircleFlag
                countryCode={target as string}
                height={20}
                width={20}
              />
              {!isMobile &&
                getLanguageByCode(searchParams?.get('target') as string)?.name}
            </SelectTrigger>
          </Select>
        </div>

        {currentSelect !== 'none' && (
          <div className="fixed left-0 z-20 h-full w-full bg-background">
            <BackLayout
              title="Select language"
              onBack={() => {
                setCurrentSelect('none');
              }}
            >
              <ListLanguages
                allowDetect={currentSelect === 'source'}
                onSelected={handleSelect}
                selectedCode={searchParams?.get(currentSelect) as string}
              />
            </BackLayout>
          </div>
        )}
      </div>
    );
  },
);
LanguagesControlBar.displayName = 'LanguagesControlBar';
