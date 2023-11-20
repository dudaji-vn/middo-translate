'use client';

import {
  AlertCircleOutline,
  CloseCircleOutline,
  Search,
} from '@easy-eva-icons/react';
import {
  DEFAULT_LANGUAGES_CODE,
  supportedLanguages,
} from '@/configs/default-language';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import React, { forwardRef, useState } from 'react';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';

import { CircleFlag } from 'react-circle-flags';
import { IconButton } from '../button';
import { Input } from '../input';
import { cn } from '@/utils/cn';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useRoomCreator } from './room-creator-context';

export interface SelectLanguagesProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const MAX_LANGUAGES = 2;

export const SelectLanguages = forwardRef<HTMLDivElement, SelectLanguagesProps>(
  (props, ref) => {
    const { selectedLanguages, setSelectedLanguages } = useRoomCreator();
    const [isOpened, setIsOpened] = useState(false);
    const isMobile = useIsMobile();

    const [isShowSearch, setIsShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const searchRef = React.useRef<any>(null);
    const handleSelect = (code: string) => {
      if (selectedLanguages.includes(code)) {
        setSelectedLanguages(selectedLanguages.filter((lang) => lang !== code));
      } else {
        const newSelectedLanguages = [...selectedLanguages, code];
        if (newSelectedLanguages.length > MAX_LANGUAGES)
          newSelectedLanguages.shift();
        setSelectedLanguages(newSelectedLanguages);
      }
    };
    const filterLanguages = supportedLanguages.filter((language) => {
      if (search === '') return true;
      return language.name.toLowerCase().includes(search.toLowerCase());
    });

    const handleClear = () => {
      setSearch('');
      searchRef.current?.focus();
    };

    const selectedLanguagesNotDefault = selectedLanguages.filter(
      (lang) => !Object.values(DEFAULT_LANGUAGES_CODE).includes(lang),
    );
    return (
      <div ref={ref} {...props}>
        <div className="formField">
          <label className="label">
            <span>
              Room&apos;s languages{' '}
              <Popover open={isOpened}>
                <PopoverTrigger asChild>
                  <button
                    className="px-2"
                    onMouseEnter={() => {
                      if (isMobile) return;
                      setIsOpened(true);
                    }}
                    onMouseLeave={() => {
                      if (isMobile) return setIsOpened(false);
                    }}
                    onClick={() => {
                      if (!isMobile) return;
                      setIsOpened(!isOpened);
                    }}
                  >
                    <AlertCircleOutline className="inline-block h-5 w-5 text-primary" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-3">
                  <span className="font-light">
                    Choose {MAX_LANGUAGES} languages for your room.
                  </span>
                </PopoverContent>
              </Popover>
            </span>
            <div className="languageCounter">
              <div className="selectedCount">{selectedLanguages.length}</div>
              <div className="defaultCount">/{MAX_LANGUAGES}</div>
            </div>
          </label>

          <div className="relative mt-2">
            <Input
              ref={searchRef}
              onFocus={() => setIsShowSearch(true)}
              // onBlur={() => setIsShowSearch(false)}

              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              leftElement={
                search === '' ? (
                  <IconButton disabled variant="ghost" size="xs">
                    <Search className="h-5 w-5" />
                  </IconButton>
                ) : (
                  <IconButton variant="ghost" size="xs">
                    <CloseCircleOutline
                      className="opacity-60"
                      onClick={handleClear}
                    />
                  </IconButton>
                )
              }
            />
            {search && isShowSearch && (
              <div className="absolute -bottom-2 z-10  w-full translate-y-full rounded-[20px]  bg-background p-3 shadow-2">
                <div className="chipsWrapper !mt-0">
                  {filterLanguages.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang.code);
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setIsShowSearch(false);
                          setSearch('');
                          if (!isSelected) {
                            handleSelect(lang.code);
                          }
                        }}
                        className={cn('chip', isSelected && 'active')}
                      >
                        <CircleFlag
                          className="inline-block"
                          countryCode={getCountryCode(lang.code) || 'gb'}
                          height={20}
                          width={20}
                        />
                        <span className="chipName">{lang.name}</span>
                      </button>
                    );
                  })}
                  {filterLanguages.length === 0 && (
                    <div className="ml-2 text-center">No results</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="chipsWrapper">
            {Object.keys(DEFAULT_LANGUAGES_CODE).map((key) => {
              const lang = getLanguageByCode(
                DEFAULT_LANGUAGES_CODE[
                  key as keyof typeof DEFAULT_LANGUAGES_CODE
                ],
              )!;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    'chip',
                    selectedLanguages.includes(lang.code) && 'active',
                  )}
                >
                  <CircleFlag
                    className="inline-block"
                    countryCode={key === 'EN' ? 'gb' : key.toLowerCase()}
                    height={20}
                    width={20}
                  />
                  <span className="chipName">{lang.name}</span>
                </button>
              );
            })}
            {selectedLanguagesNotDefault.map((code) => {
              const lang = getLanguageByCode(code || 'en')!;
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setIsShowSearch(false);
                    handleSelect(lang.code);
                  }}
                  className={cn('chip', isSelected && 'active')}
                >
                  <CircleFlag
                    className="inline-block"
                    countryCode={getCountryCode(lang.code) || 'gb'}
                    height={20}
                    width={20}
                  />
                  <span className="chipName">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
SelectLanguages.displayName = 'SelectLanguages';
