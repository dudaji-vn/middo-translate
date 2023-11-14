'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';

import { forwardRef } from 'react';
import { getLanguageByCode } from '@/utils/language-fn';
import { useRoomJoiner } from './room-joiner-context';

export interface SelectNativeLanguageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectNativeLanguage = forwardRef<
  HTMLDivElement,
  SelectNativeLanguageProps
>((props, ref) => {
  const { selectedNativeLanguage, setSelectedNativeLanguage, room } =
    useRoomJoiner();
  const languages =
    room?.languages.map((lang) => getLanguageByCode(lang)) ?? [];
  return (
    <div ref={ref} {...props}>
      <Select
        value={selectedNativeLanguage}
        onValueChange={setSelectedNativeLanguage}
        disabled={languages.length === 0}
      >
        <SelectTrigger
          style={{
            borderWidth: '1px',
          }}
          className="w-full border-stroke px-5 shadow-none"
        >
          <SelectValue placeholder="Select your native language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language!.code} value={language!.code}>
              {language!.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
SelectNativeLanguage.displayName = 'SelectNativeLanguage';
