'use client';

import { CheckCircle2Icon, Globe2Icon } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { SearchInput } from '@/components/data-entry';
import { SUPPORTED_LANGUAGES } from '@/configs/default-language';
import { Country } from '@/types/country.type';
import { cn } from '@/utils/cn';
import { useLanguageStore } from '../../stores/language.store';
import { useAppStore } from '@/stores/app.store';
import { useTranslation } from 'react-i18next';

export interface ListLanguagesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedCode: string;
  onSelected: (code: string) => void;
  allowDetect?: boolean;
  type: 'source' | 'target';
}

export const ListLanguages = forwardRef<HTMLDivElement, ListLanguagesProps>(
  ({ selectedCode, onSelected, allowDetect, type, ...props }, ref) => {
    const [search, setSearch] = useState('');
    const isMobile = useAppStore((state) => state.isMobile);
    const searchRef = useRef<any>(null);
    const { recentlySourceUsed, recentlyTargetUsed, addRecentlyUsed } =
      useLanguageStore();
    const {t} = useTranslation('common');
    const recentlyUsed = useMemo(() => {
      {
        return Array.from(
          new Set([...recentlySourceUsed, ...recentlyTargetUsed]),
        );
      }
    }, [recentlySourceUsed, recentlyTargetUsed]);

    const handleSelected = (code: string) => {
      addRecentlyUsed(code, type);
      onSelected(code);
    };
    const filterLanguages = SUPPORTED_LANGUAGES.filter((language) => {
      if (search === '') return true;
      return language.name.toLowerCase().includes(search.toLowerCase());
    });

    useEffect(() => {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          searchRef.current?.blur();
        }
      };
      window.addEventListener('keydown', handleEnter);
      return () => {
        window.removeEventListener('keydown', handleEnter);
      };
    }, []);

    return (
      <div ref={ref} {...props} className="flex h-full flex-col">
        <div className="px-5 py-5 pt-0 md:mx-auto md:w-[480px] ">
          <SearchInput
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('COMMON.SEARCH')}
            onClear={() => setSearch('')}
          />
        </div>
        <div className="flex flex-col overflow-y-auto md:flex-row md:flex-wrap">
          {search === '' ? (
            <>
              {allowDetect && (
                <Item
                  selected={selectedCode === 'auto'}
                  rightElement={
                    <Globe2Icon className="mr-2 h-5 w-5 text-primary" />
                  }
                  language={{
                    code: 'auto',
                    name: 'Language detect',
                  }}
                  onClick={onSelected.bind(null, 'auto')}
                />
              )}

              {recentlyUsed.length > 0 && isMobile && (
                <>
                  <Title>{t('COMMON.RECENTLY_USED')}</Title>
                  {recentlyUsed.map((code) => {
                    const language = SUPPORTED_LANGUAGES.find(
                      (item) => item.code === code,
                    );
                    return (
                      language && (
                        <Item
                          onClick={() => {
                            onSelected(code);
                            handleSelected(code);
                          }}
                          selected={code === selectedCode}
                          key={code}
                          language={language}
                        />
                      )
                    );
                  })}
                </>
              )}
              <Title>{t('COMMON.ALL_LANGUAGES')}</Title>
              {SUPPORTED_LANGUAGES.map((language) => (
                <Item
                  onClick={handleSelected.bind(null, language.code)}
                  selected={language.code === selectedCode}
                  key={language.code}
                  language={language}
                />
              ))}
            </>
          ) : (
            <>
              {filterLanguages.map((language) => (
                <Item
                  onClick={handleSelected.bind(null, language.code)}
                  selected={language.code === selectedCode}
                  key={language.code}
                  language={language}
                />
              ))}
            </>
          )}
        </div>
      </div>
    );
  },
);
ListLanguages.displayName = 'ListLanguages';

const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="mb-3 mt-6 inline w-full pl-5 text-secondary md:hidden md:w-1/3">
      {children}
    </p>
  );
};

const Item = ({
  language,
  selected = false,
  onClick,
  rightElement,
}: {
  language: Country;
  selected?: boolean;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}) => {
  const {t} = useTranslation('common');
  return (
    <button
      disabled={selected}
      onClick={onClick}
      key={language.code}
      className={cn(
        'flex w-full items-center px-5 py-3 active:bg-stroke md:w-1/3 md:hover:bg-background-darker',
        selected && 'bg-lighter text-primary disabled:bg-lighter',
      )}
    >
      {rightElement}
      <span className={cn(selected && 'font-semibold text-primary')}>
        {t('LANGUAGE.' + language.name)}
      </span>
      {selected && <CheckCircle2Icon className="ml-auto h-5 w-5 " />}
    </button>
  );
};
