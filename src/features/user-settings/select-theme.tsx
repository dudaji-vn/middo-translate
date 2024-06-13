import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import { ChevronRight, SunMoonIcon } from 'lucide-react';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
const themes = [
  {
    value: 'light',
    title: 'COMMON.LIGHT'
  },
  {
    value: 'dark',
    title: 'COMMON.DARK'
  },
  {
    value: 'system',
    title: 'COMMON.SYSTEM'
  }
]
interface InputSelect {
  value: string;
  title: string;
}

const SelectTheme = () => {
  const themeSetting = useAppStore((state) => state.themeSetting);
  const setThemeSetting = useAppStore((state) => state.setThemeSetting);
  
  const [isOpenDropdown, setOpenDropdown] = useState(false);
  const [valueSelect, setValueSelect] = useState<InputSelect>({
    value: '',
    title: '',
  });
  const { t } = useTranslation('common');
  const handleSelectChange = useCallback((value: any) => {
    setOpenDropdown(false);
    setThemeSetting(value);
  }, [setThemeSetting]);

  useEffect(() => {
    let itemSelected = themes?.find(
      (item: any) => item.value === themeSetting,
    );
    if(!itemSelected) {
      itemSelected = themes[themes.length - 1];
    }
    setValueSelect(itemSelected);
  }, [themeSetting]);

  return (
    <div className="flex w-full items-center border-b bg-white dark:bg-neutral-900 dark:border-b-neutral-800 px-5 py-4">
      <div className="relative flex !h-10 !w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-50">
        <SunMoonIcon size={20} />
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
