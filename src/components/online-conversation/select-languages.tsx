'use client';

import {
  AlertCircleOutline,
  CloseCircleOutline,
  Search,
} from '@easy-eva-icons/react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import React, { forwardRef, useEffect, useState } from 'react';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';

import { CircleFlag } from 'react-circle-flags';
import { IconButton } from '../button';
import { Input } from '../input';
import { cn } from '@/utils/cn';
import { supportedLanguages } from '@/configs/default-language';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useOnClickOutside } from 'usehooks-ts';
import { useRoomCreator } from './room-creator-context';

export const DEFAULT_LANGUAGES_CODE = {
  VN: 'vi',
  KR: 'ko',
  JP: 'ja',
  CN: 'zh-CN',
  ES: 'es',
};
export interface SelectLanguagesProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const MAX_LANGUAGES = 2;

export const SelectLanguages = forwardRef<HTMLDivElement, SelectLanguagesProps>(
  (props, ref) => {
    const { selectedLanguages, setSelectedLanguages } = useRoomCreator();
    const [isOpened, setIsOpened] = useState(false);
    const isMobile = useIsMobile();

    const [isShowSearch, setIsShowSearch] = useState(false);

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

    const selectedLanguagesNotDefault = selectedLanguages.filter(
      (lang) => !Object.values(DEFAULT_LANGUAGES_CODE).includes(lang),
    );

    return (
      <div ref={ref} {...props}>
        <div className="formField">
          <label className="label">
            <span>
              Choose room&apos;s languages{' '}
              <Popover open={isOpened}>
                <PopoverTrigger asChild>
                  <button
                    className="px-2"
                    onMouseEnter={() => {
                      if (isMobile) return;
                      setIsOpened(true);
                    }}
                    onMouseLeave={() => {
                      if (isMobile) return;
                      setIsOpened(false);
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

          {isShowSearch && (
            <SearchPanel
              handleSelect={handleSelect}
              selectedLanguages={selectedLanguages}
              setIsShowSearch={setIsShowSearch}
            />
          )}

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
            <IconButton
              variant="secondary"
              size="sm"
              className="shadow-1"
              onClick={() => {
                setIsShowSearch(true);
              }}
            >
              <Search className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  },
);
SelectLanguages.displayName = 'SelectLanguages';

const SearchPanel = ({
  selectedLanguages,
  setIsShowSearch,
  handleSelect,
  onOutsideClick,
}: {
  setIsShowSearch: (isShowSearch: boolean) => void;
  selectedLanguages: string[];
  handleSelect: (code: string) => void;
  onOutsideClick?: () => void;
}) => {
  const parentRef = React.useRef<any>(null);
  const searchRef = React.useRef<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current?.focus();
    }
  }, [searchRef]);

  const filterLanguages = supportedLanguages.filter((language) => {
    if (search === '') return true;
    return language.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleClear = () => {
    setSearch('');
    searchRef.current?.focus();
  };
  useOnClickOutside(
    parentRef,
    onOutsideClick || (() => setIsShowSearch(false)),
  );

  return (
    <div className="relative">
      <div
        ref={parentRef}
        className={cn(
          'absolute -bottom-2 z-10 flex max-h-[50vh] w-full translate-y-full flex-col rounded-[20px]  bg-background p-3 shadow-2',
          !search && 'min-h-[32vh]',
        )}
      >
        <Input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          leftElement={
            search === '' ? (
              <IconButton disabled variant="ghost" size="xs">
                <Search className="h-5 w-5 opacity-60" />
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
        {search && (
          <div className="chipsWrapper  !mt-3 mb-3 h-full flex-1 overflow-y-auto">
            {filterLanguages.map((lang) => {
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={(e) => {
                    e.stopPropagation();

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
        )}
        <button
          onClick={() => setIsShowSearch(false)}
          className="hover: group mt-auto rounded-xl  bg-[#fafafa] py-2"
        >
          <span className="text-primary group-hover:font-medium group-active:text-shading">
            Close
          </span>
        </button>
      </div>
    </div>
  );
};
