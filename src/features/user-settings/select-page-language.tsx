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
    const { t } = useTranslation('common');
    const handleSelectChange = useCallback(
      (value: any) => {
        setLanguage(value);
        setOpenDropdown(false);
      },
      [setLanguage],
    );
  
    useEffect(() => {
        let itemSelected = I18N_SUPPORTED_LANGUAGES?.find(
            (item: any) => item.value === language,
        );
        if(!itemSelected) {
            itemSelected = I18N_SUPPORTED_LANGUAGES[0];
        }
        setValueSelect(itemSelected);
    }, [language]);
    return (
      <div className="flex w-full items-center border-b border-b-[#F2F2F2] bg-white px-5 py-4">
        <Button.Icon
          variant={'ghost'}
          color={'default'}
          size={'sm'}
          className="relative !h-10 !w-10 rounded-xl bg-neutral-50"
        >
          <Globe2 size={20} />
        </Button.Icon>
        <span className="ml-4 block flex-1 text-base font-medium">
          {t('ACCOUNT_SETTING.DISPLAY_LANGUAGE')}
        </span>
        <DropdownMenu open={isOpenDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger>
            <div className="group relative flex w-full items-center gap-1 rounded-xl px-3 py-1">
              {valueSelect?.value && (
                <>
                  <CircleFlag
                    countryCode={LANGUAGE_CODES_MAP[
                      valueSelect.value as keyof typeof LANGUAGE_CODES_MAP
                    ].toLowerCase()}
                    className="inline-block h-5 w-5 overflow-hidden rounded-full"
                  />
                  <div
                    className={cn(
                      'relative left-0 flex items-center justify-center rounded-full transition-all md:group-hover:rotate-90 md:group-active:rotate-90',
                      isOpenDropdown ? 'rotate-90' : '',
                    )}
                  >
                    <ChevronRight className="opacity-60" />
                  </div>
                </>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={() => setOpenDropdown(false)}>
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
  