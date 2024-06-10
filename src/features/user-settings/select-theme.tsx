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
import { ChevronDownIcon, ChevronRight, Globe2, MoonIcon } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/vi';
import 'moment/locale/ko';
import 'moment/locale/en-gb';

import React, { useCallback, useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
const themes = [
    {
        value: 'light',
        title: 'COMMON.OFF'
    },
    {
        value: 'dark',
        title: 'COMMON.ON'
    }
]
interface InputSelect {
  value: string;
  title: string;
}

const SelectTheme = () => {
  const { theme, setTheme } = useAppStore();
  const [isOpenDropdown, setOpenDropdown] = useState(false);
  const [valueSelect, setValueSelect] = useState<InputSelect>({
    value: '',
    title: '',
  });
  const { t } = useTranslation('common');
  const handleSelectChange = useCallback((value: any) => {
    
    setTheme(value);    
    setOpenDropdown(false);
  }, [setTheme]);

  useEffect(() => {
    let itemSelected = themes?.find(
        (item: any) => item.value === theme,
    );
    if(!itemSelected) {
        itemSelected = themes[0];
    }
    setValueSelect(itemSelected);
  }, [theme]);


  return (
    <div className="flex w-full items-center border-b bg-white dark:bg-neutral-900 dark:border-b-neutral-800 px-5 py-4">
      <div className="relative flex !h-10 !w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-50">
        <MoonIcon size={20} />
      </div>
      <span className="ml-4 block flex-1 text-base font-medium">
        {t('ACCOUNT_SETTING.THEME')}
      </span>
      <DropdownMenu open={isOpenDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger>
          <div className="group relative flex w-full items-center gap-1 rounded-xl px-4 md:h-9 h-11 bg-neutral-50 dark:bg-neutral-800">
            {valueSelect?.value && (
              <>
                <span>{t(valueSelect?.title)}</span>
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
        <DropdownMenuContent align="end" onClick={() => setOpenDropdown(false)} className='dark:bg-neutral-900 dark:border-neutral-800'>
          {themes?.map((option: InputSelect) => {
              return (
                <DropdownMenuItem
                  className={cn(
                    'flex items-center dark:hover:bg-neutral-800',
                    option.value == valueSelect.value
                      ? '!bg-primary !text-white'
                      : '',
                  )}
                  onClick={() => handleSelectChange(option.value)}
                  key={option.value}
                >
                  <span className="pr-4">{t(option.title)}</span>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectTheme;
