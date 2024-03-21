import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/data-entry';
import {
  LANGUAGE_CODES_MAP,
  SUPPORTED_VOICE_MAP,
} from '@/configs/default-language';
import { ROUTE_NAMES } from '@/configs/route-name';
import I18N_SUPPORTED_LANGUAGES from '@/lib/i18n/support_language';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import React, {
  HtmlHTMLAttributes,
  ReactElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { CircleFlag } from 'react-circle-flags';
import { useTranslation } from 'react-i18next';
interface InputSelect {
  value: string;
  title: string;
}

interface InputSelectLanguageProps {
  className?: string;
}

const HeaderSelectLanguage = ({ className }: InputSelectLanguageProps) => {
  const { language, setLanguage } = useAppStore();
  const [valueSelect, setValueSelect] = useState<InputSelect>({
    value: '',
    title: '',
  });
  // import change language function
  const { i18n, t } = useTranslation('common')
  const handleSelectChange = useCallback(
    (value: any) => {
      let itemSelected = I18N_SUPPORTED_LANGUAGES?.find(
        (item: any) => item.value === value,
      );
      setValueSelect(itemSelected as InputSelect);
      localStorage.setItem('i18nLng', value);
      setLanguage(value);
      i18n.changeLanguage(value)
    },
    [i18n, setLanguage],
  );

  useEffect(() => {
    const currentLanguage = localStorage.getItem('i18nLng');
    let lang = '';
    if (!currentLanguage) {
      const browserLanguage = navigator.language;
      let deceiveLanguage = 'en';
      for (const [key, value] of Object.entries(SUPPORTED_VOICE_MAP)) {
        if (value == browserLanguage) {
          deceiveLanguage = key;
          break;
        }
      }
      const isSupport = I18N_SUPPORTED_LANGUAGES.find(
        (item) => item.value === deceiveLanguage,
      );
      lang = isSupport ? deceiveLanguage : 'en';
    } else {
      const isSupport = I18N_SUPPORTED_LANGUAGES.find(
        (item) => item.value === currentLanguage,
      );
      lang = isSupport ? currentLanguage : 'en';
    }
    handleSelectChange(lang);
    setLanguage(lang);
    i18n.changeLanguage(lang)
  }, [handleSelectChange, i18n, setLanguage]);
  return (
    <div className={cn(className)}>
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="flex w-full rounded-xl px-2 py-2">
          {!valueSelect?.value && <span className="opacity-60"></span>}
          {valueSelect?.value && (
            <>
              <CircleFlag
                countryCode={LANGUAGE_CODES_MAP[
                  valueSelect.value as keyof typeof LANGUAGE_CODES_MAP
                ].toLowerCase()}
                className="mr-2 inline-block h-5 w-5"
              />
              {/* <span className="flex-1 text-left">{valueSelect.title}</span> */}
            </>
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {I18N_SUPPORTED_LANGUAGES?.length > 0 &&
            I18N_SUPPORTED_LANGUAGES?.map((option: any) => {
              return (
                <SelectItem
                  value={option.value}
                  key={option.value}
                  className={cn("px-3", option.value === valueSelect.value && '!bg-primary !text-white')}
                >
                  <CircleFlag
                    countryCode={LANGUAGE_CODES_MAP[
                      option.value as keyof typeof LANGUAGE_CODES_MAP
                    ].toLowerCase()}
                    className="mr-2 inline-block h-5"
                  />
                  <span className="pr-4">{t('LANGUAGE.'+option.title)}</span>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeaderSelectLanguage;
