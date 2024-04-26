import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import {
  LANGUAGE_CODES_MAP,
  SUPPORTED_VOICE_MAP,
} from '@/configs/default-language';
import I18N_SUPPORTED_LANGUAGES from '@/lib/i18n/support_language';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import { ChevronDownIcon, ChevronRight, Globe2 } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/vi';
import 'moment/locale/ko';
import 'moment/locale/en-gb';

import React, { useCallback, useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
interface InputSelect {
  value: string;
  title: string;
}

const SelectPageLanguage = () => {
  const { language, setLanguage } = useAppStore();
  moment.locale(language);
  const [isOpenDropdown, setOpenDropdown] = useState(false);
  const [valueSelect, setValueSelect] = useState<InputSelect>({
    value: '',
    title: '',
  });
  // import change language function
  const { i18n, t } = useTranslation('common');
  const handleSelectChange = useCallback(
    (value: any) => {
      let itemSelected = I18N_SUPPORTED_LANGUAGES?.find(
        (item: any) => item.value === value,
      );
      setValueSelect(itemSelected as InputSelect);
      localStorage.setItem('i18nLng', value);
      setLanguage(value);
      i18n.changeLanguage(value);
      setOpenDropdown(false);
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
    i18n.changeLanguage(lang);
  }, [handleSelectChange, i18n, setLanguage]);
  return (
    <div className="flex w-full items-center border-b border-b-[#F2F2F2] bg-white px-5 py-4">
      <Button.Icon
        variant={'ghost'}
        color={'default'}
        size={'sm'}
        className="relative rounded-xl bg-neutral-50 !w-10 !h-10"
      >
        <Globe2 size={20} />
      </Button.Icon>
      <span className="ml-4 block text-base font-medium flex-1">
        {t('ACCOUNT_SETTING.DISPLAY_LANGUAGE')}
      </span>
      <DropdownMenu open={isOpenDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger>
          <div className="relative flex w-full items-center gap-1 rounded-xl px-3 py-1 group">
            {valueSelect?.value && (
              <>
                <CircleFlag
                  countryCode={LANGUAGE_CODES_MAP[
                    valueSelect.value as keyof typeof LANGUAGE_CODES_MAP
                  ].toLowerCase()}
                  className="inline-block h-5 w-5 overflow-hidden rounded-full"
                />
                <div className={cn('relative left-0 flex items-center justify-center rounded-full md:group-hover:rotate-90 transition-all md:group-active:rotate-90', isOpenDropdown ? 'rotate-90' : '')}>
                  <ChevronRight className="opacity-60" />
                </div>
              </>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={() => setOpenDropdown(false)}
        >
          {I18N_SUPPORTED_LANGUAGES?.length > 0 &&
            I18N_SUPPORTED_LANGUAGES?.map((option: InputSelect) => {
              return (
                <DropdownMenuItem
                  className={cn(
                    'flex items-center',
                    option.value == valueSelect.value
                      ? '!bg-primary !text-white'
                      : '',
                  )}
                  onClick={() => handleSelectChange(option.value)}
                  key={option.value}
                >
                  <CircleFlag
                    countryCode={LANGUAGE_CODES_MAP[
                      option.value as keyof typeof LANGUAGE_CODES_MAP
                    ].toLowerCase()}
                    className="mr-2 inline-block h-5 overflow-hidden rounded-full"
                  />
                  <span className="pr-4">{option.title}</span>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectPageLanguage;
