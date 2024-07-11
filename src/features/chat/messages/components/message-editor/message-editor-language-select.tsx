import {
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/data-entry';
import {
  LANGUAGE_CODES_MAP,
  SUPPORTED_LANGUAGES,
} from '@/configs/default-language';
import { useMSEditorStore } from '@/features/chat/stores/editor-language.store';
import { detectLanguage } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { Editor } from '@tiptap/react';
import { Globe2Icon } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
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

  useEffect(() => {
    if (!languageCode && user?.language) {
      setLanguageCode(user.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.language, languageCode]);

  if (languageCode === null) return null;

  return (
    <div className="w-full">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="h-11 w-full rounded-xl dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700 md:h-10 md:w-[240px]">
          {selectedOption?.value === 'auto' && (
            <>
              <Globe2Icon className="mr-2 inline-block h-4 w-4 text-primary " />
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
        </SelectTrigger>
        <SelectContent className="relative max-h-[300px] w-full overflow-y-auto dark:border-neutral-800 dark:bg-neutral-900 md:w-[240px]">
          <div className="fixed left-0 top-0 z-10 w-full bg-white p-2 dark:bg-neutral-900">
            <SearchInput />
          </div>
          <div className="h-[60px]" />

          {languageOptions?.map((option) => {
            if (option.value === 'auto')
              return (
                <SelectItem key={option.value} value="auto">
                  <Globe2Icon className="mr-2 inline-block h-4 w-4 text-primary " />
                  <span className=" flex-1 text-left">
                    {t('COMMON.' + option.title)}
                  </span>
                </SelectItem>
              );
            return (
              <SelectItem
                value={option.value}
                key={option.value}
                className="dark:hover:bg-neutral-800"
              >
                <CircleFlag
                  countryCode={LANGUAGE_CODES_MAP[
                    option.value as keyof typeof LANGUAGE_CODES_MAP
                  ].toLowerCase()}
                  className="mr-2 inline-block h-5 w-5 overflow-hidden rounded-full"
                />
                <span>{t('LANGUAGE.' + option.title)}</span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
