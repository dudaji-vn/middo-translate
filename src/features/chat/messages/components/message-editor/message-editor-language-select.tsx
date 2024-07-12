import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { SearchInput } from '@/components/data-entry';
import {
  LANGUAGE_CODES_MAP,
  SUPPORTED_LANGUAGES,
} from '@/configs/default-language';
import { useMSEditorStore } from '@/features/chat/stores/editor-language.store';
import { detectLanguage } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { Editor } from '@tiptap/react';
import { ChevronUpIcon, Globe2Icon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { useTranslation } from 'react-i18next';
import { useDebounceValue } from 'usehooks-ts';

export const MessageEditorLanguageSelect = ({
  editor,
}: {
  editor: Editor | null;
}) => {
  const user = useAuthStore((state) => state.user);
  const {
    languageCode,
    setLanguageCode,
    detectedLanguage,
    setDetectedLanguage,
  } = useMSEditorStore((state) => state);
  const [debouncedValue] = useDebounceValue(editor?.getText().trim(), 500);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);

  useQuery({
    enabled: !!debouncedValue && languageCode === 'auto',
    queryKey: ['detect-language', debouncedValue],
    queryFn: () => detectLanguage(debouncedValue!),
    onSuccess: (data) => {
      if (data) {
        setDetectedLanguage(data);
      }
    },
  });

  useEffect(() => {
    if (!debouncedValue && languageCode === 'auto') {
      setDetectedLanguage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, languageCode]);

  const languageOptions = useMemo(() => {
    const list = [{ value: 'auto', title: 'DETECT_LANGUAGE' }];
    SUPPORTED_LANGUAGES.forEach((lang) => {
      list.push({ value: lang.code, title: lang.name });
    });
    return list;
  }, []);

  const { t } = useTranslation('common');

  const handleSelectChange = useCallback(
    (value: string) => {
      setOpen(false);
      let itemSelected = languageOptions?.find((item) => item.value === value);
      setLanguageCode(itemSelected?.value!);
      setDetectedLanguage(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [languageOptions],
  );

  const selectedOption = useMemo(() => {
    if (!languageCode) return languageOptions?.[0];
    return languageOptions?.find((item: any) => item.value === languageCode);
  }, [languageCode, languageOptions]);

  const searchOptions = useMemo(() => {
    return languageOptions?.filter((item) => {
      if (searchValue === '') return true;
      return item.title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [languageOptions, searchValue]);

  useEffect(() => {
    if (!languageCode && user?.language) {
      setLanguageCode(user.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.language, languageCode]);

  if (languageCode === null) return null;

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex h-11 w-full items-center justify-start rounded-xl bg-neutral-50 px-3 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700 md:h-10 md:w-[240px]">
          {selectedOption?.value === 'auto' && (
            <>
              <Globe2Icon className="mr-2 inline-block size-5 text-primary " />
              <span className=" flex-1 text-left">
                {detectedLanguage
                  ? `${t('LANGUAGE.Detected')}: ${detectedLanguage.toUpperCase()}`
                  : t('COMMON.' + selectedOption.title)}
              </span>
            </>
          )}
          {selectedOption?.value && selectedOption.value !== 'auto' && (
            <>
              <CircleFlag
                countryCode={LANGUAGE_CODES_MAP[
                  selectedOption.value as keyof typeof LANGUAGE_CODES_MAP
                ].toLowerCase()}
                className="mr-2 inline-block h-5 w-5 overflow-hidden rounded-full"
              />
              <span className=" flex-1 text-left">
                {t('LANGUAGE.' + selectedOption.title)}
              </span>
            </>
          )}
          <ChevronUpIcon />
        </PopoverTrigger>
        <PopoverContent className="no-scrollbar relative max-h-[300px] w-[--radix-popover-trigger-width]  overflow-hidden overflow-y-auto p-0 md:w-[240px]">
          <div className="fixed left-0 top-0 z-10 w-full rounded-t-xl border border-b-0 bg-white p-2 dark:bg-neutral-900">
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('COMMON.SEARCH')}
              className="w-full"
              wrapperClassName="rounded-[8px]"
            />
          </div>
          <div className="h-[60px]" />
          {searchOptions?.map((option) => {
            if (option.value === 'auto')
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectChange(option.value)}
                  className="relative flex w-full
                   cursor-default select-none items-center rounded-sm px-3 py-4 outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Globe2Icon className="mr-2 inline-block size-5 text-primary " />
                  <span className=" flex-1 text-left">
                    {t('COMMON.' + option.title)}
                  </span>
                </button>
              );
            return (
              <button
                onClick={() => handleSelectChange(option.value)}
                key={option.value}
                className="relative flex w-full
                 cursor-default select-none items-center rounded-sm px-3 py-4 outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 "
              >
                <CircleFlag
                  countryCode={LANGUAGE_CODES_MAP[
                    option.value as keyof typeof LANGUAGE_CODES_MAP
                  ].toLowerCase()}
                  className="mr-2 inline-block h-5 w-5 overflow-hidden rounded-full"
                />
                <span>{t('LANGUAGE.' + option.title)}</span>
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
};
