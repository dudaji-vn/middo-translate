'use client';

import { CloseCircleOutline, Search } from '@easy-eva-icons/react';
import {
  DEFAULT_LANGUAGES_CODE,
  supportedLanguages,
} from '@/configs/default-language';
import React, { forwardRef, useState } from 'react';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';

import { CircleFlag } from 'react-circle-flags';
import { IconButton } from '../button';
import { Input } from '../input';
import { cn } from '@/utils/cn';
import { useRoomCreator } from './room-creator-context';

export interface SelectLanguagesProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const MAX_LANGUAGES = 2;

export const SelectLanguages = forwardRef<HTMLDivElement, SelectLanguagesProps>(
  (props, ref) => {
    const { selectedLanguages, setSelectedLanguages } = useRoomCreator();
    const [selectedLanguagesNotDefault, setSelectedLanguagesNotDefault] =
      useState<string[]>([]);

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
    return (
      <div ref={ref} {...props}>
        <div className="formField">
          <label className="label">
            Room&apos;s language
            <div className="languageCounter">
              <div className="selectedCount">{selectedLanguages.length}</div>
              <div className="defaultCount">/{MAX_LANGUAGES}</div>
            </div>
          </label>

          <div className="relative">
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
                      <div
                        key={lang.code}
                        onClick={() => {
                          setIsShowSearch(false);
                          setSearch('');
                          const isDefault = Object.values(
                            DEFAULT_LANGUAGES_CODE,
                          ).includes(lang.code);
                          if (!isDefault)
                            setSelectedLanguagesNotDefault([
                              ...selectedLanguagesNotDefault,
                              lang.code,
                            ]);
                          if (!isSelected) handleSelect(lang.code);
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
                      </div>
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
                <div
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
                </div>
              );
            })}
            {selectedLanguagesNotDefault.map((code) => {
              const lang = getLanguageByCode(code || 'en')!;
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <div
                  key={lang.code}
                  onClick={() => {
                    setIsShowSearch(false);
                    if (!isSelected) handleSelect(lang.code);
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
SelectLanguages.displayName = 'SelectLanguages';
