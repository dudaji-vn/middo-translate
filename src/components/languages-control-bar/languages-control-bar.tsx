'use client';

import { Globe2Outline, Swap } from '@easy-eva-icons/react';
import { Select, SelectTrigger } from '@/components/select';
import { forwardRef, useEffect, useState } from 'react';

import { BackLayout } from '../layout/back-layout';
import { CircleFlag } from 'react-circle-flags';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { ListLanguages } from '../list-languages';
import { cn } from '@/utils/cn';
import { getCountryCode } from '@/utils/language-fn';
import { useSetParams } from '@/hooks/use-set-params';

export interface LanguagesControlBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  source?: string;
  target?: string;
  detect?: string;
}

export const LanguagesControlBar = forwardRef<
  HTMLDivElement,
  LanguagesControlBarProps
>((props, ref) => {
  const [currentSelect, setCurrentSelect] = useState<
    'source' | 'target' | 'none'
  >('none');
  const { searchParams, setParams, setParam, removeParam } = useSetParams();
  const source = getCountryCode(searchParams.get('source'), true);
  const target = getCountryCode(
    searchParams.get('target') || DEFAULT_LANGUAGES_CODE.EN,
  );

  const handleSwap = () => {
    if (!props.source || !props.target) return;
    setParams([
      {
        key: 'source',
        value: props.target,
      },
      {
        key: 'target',
        value: props.source,
      },
    ]);
  };

  const handleSelect = (code: string) => {
    setCurrentSelect('none');
    if (currentSelect === 'source') {
      if (code === searchParams.get('target')) {
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
    if (code === searchParams.get('source')) {
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
    if (!searchParams.get('target')) {
      setParams([
        {
          key: 'target',
          value: DEFAULT_LANGUAGES_CODE.EN,
        },
      ]);
    }

    if (!searchParams.get('source')) {
      setParams([
        {
          key: 'source',
          value: 'auto',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  // useEffect(() => {
  //   if (props.detect) {
  //     setParam('detect', props.detect);
  //   } else {
  //     removeParam('detect');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.detect]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn('gap-5" flex w-full justify-center', props.className)}
    >
      <Select>
        <SelectTrigger
          onClick={() => {
            setCurrentSelect('source');
          }}
        >
          {source && source !== 'auto' ? (
            <CircleFlag
              countryCode={source}
              height={20}
              width={20}
              className="mr-2.5"
            />
          ) : (
            <Globe2Outline className="mr-2.5 h-5 w-5 text-primary" />
          )}
        </SelectTrigger>
      </Select>
      <button
        onClick={handleSwap}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full p-2.5 transition-all duration-200 active:bg-stroke md:hover:bg-background-darker"
      >
        <Swap />
      </button>
      <Select>
        <SelectTrigger
          onClick={() => {
            setCurrentSelect('target');
          }}
        >
          <CircleFlag
            countryCode={target as string}
            height={20}
            width={20}
            className="mr-2.5"
          />
        </SelectTrigger>
      </Select>
      {currentSelect !== 'none' && (
        <div className="fixed left-0 z-10 h-full w-full bg-background">
          <BackLayout
            title="Select language"
            onBack={() => {
              setCurrentSelect('none');
            }}
          >
            <ListLanguages
              allowDetect={currentSelect === 'source'}
              onSelected={handleSelect}
              selectedCode={searchParams.get(currentSelect) as string}
            />
          </BackLayout>
        </div>
      )}
    </div>
  );
});
LanguagesControlBar.displayName = 'LanguagesControlBar';
