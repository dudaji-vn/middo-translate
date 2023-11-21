'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';

import { CircleFlag } from 'react-circle-flags';
import { forwardRef } from 'react';
import { useRoomCreator } from './room-creator-context';

export interface SelectNativeLanguageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectNativeLanguage = forwardRef<
  HTMLDivElement,
  SelectNativeLanguageProps
>((props, ref) => {
  const {
    selectedLanguages,
    selectedNativeLanguage,
    setSelectedNativeLanguage,
  } = useRoomCreator();
  const languages = selectedLanguages.map((lang) => getLanguageByCode(lang));
  return (
    <div ref={ref} {...props}>
      <Select
        value={selectedNativeLanguage}
        onValueChange={setSelectedNativeLanguage}
        disabled={selectedLanguages.length === 0}
      >
        <SelectTrigger
          style={{
            borderWidth: '1px',
          }}
          className="w-full border-stroke px-5 shadow-none"
        >
          <SelectValue placeholder="Select your native language" />
        </SelectTrigger>
        <SelectContent
          ref={(ref) => {
            if (!ref) return;
            ref.ontouchstart = (e) => {
              e.preventDefault();
            };
          }}
        >
          {languages.map((language) => (
            <SelectItem key={language!.code} value={language!.code}>
              <CircleFlag
                className="mr-2 inline-block"
                countryCode={getCountryCode(language!.code) || 'gb'}
                height={20}
                width={20}
              />
              {language!.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
SelectNativeLanguage.displayName = 'SelectNativeLanguage';
