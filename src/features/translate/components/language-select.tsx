import { Button } from '@/components/actions';
import { cn } from '@/utils/cn';
import { getCountryCode, getCountryNameByCode } from '@/utils/language-fn';
import { ChevronDownIcon, Globe2Icon } from 'lucide-react';
import { PropsWithChildren, useId } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface LanguageSelectProps {
  currentCode?: string;
  languageCodes: string[];
  onChevronClick?: () => void;
  onChange?: (code: string) => void;
  shrinkAble?: boolean;
}

export const LanguageSelect = ({
  onChevronClick,
  currentCode,
  shrinkAble,
  languageCodes = [],
  onChange,
}: LanguageSelectProps) => {
  const id = useId();
  return (
    <div className="flex h-[42px] w-full flex-1 items-center gap-2">
      <div className="flex h-full w-full max-w-full gap-2 overflow-hidden rounded-xl font-semibold dark:bg-neutral-900 lg:w-fit lg:max-w-[calc(100%-48px)] lg:bg-neutral-50 lg:p-1">
        {languageCodes.map((code) => (
          <LanguageItem
            shrinkAble={shrinkAble}
            layoutId={id}
            key={code}
            onClick={() => {
              onChange?.(code);
            }}
            active={currentCode === code}
            code={code}
          />
        ))}
      </div>
      <Button.Icon
        className="hidden lg:flex"
        onClick={onChevronClick}
        color="default"
        size="xs"
      >
        <ChevronDownIcon />
      </Button.Icon>
    </div>
  );
};

export const LanguageItem = ({
  active,
  code,
  className,
  onClick,
  shrinkAble,
  layoutId,
}: {
  code: string;
  active?: boolean;
  shrinkAble?: boolean;
  className?: string;
  onClick?: () => void;
  layoutId?: string;
} & PropsWithChildren) => {
  const languageName =
    getCountryNameByCode(code as string) || 'Language detect';
  const { t } = useTranslation('common');
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex h-full w-full items-center justify-between gap-2 rounded-xl px-2 py-3 lg:w-fit lg:justify-center lg:px-3',
        active
          ? 'text-primary '
          : 'hidden text-neutral-700 dark:text-neutral-50 lg:flex',
        className,
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId || 'bubble'}
          className="absolute inset-0 z-10 rounded-xl border border-primary-200 bg-primary-100 dark:border-primary-900 dark:bg-neutral-950 lg:rounded-lg"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          exit={{ boxShadow: 'none' }}
        />
      )}

      {code && code !== 'auto' ? (
        <div className="z-10 size-5 overflow-hidden rounded-full">
          <CircleFlag
            countryCode={getCountryCode(code as string) as string}
            height={20}
            width={20}
            className="z-10"
          />
        </div>
      ) : (
        <Globe2Icon className="z-10 size-5 shrink-0 text-primary" />
      )}

      {
        <span
          className={cn('z-10 truncate', shrinkAble && !active && 'hidden')}
        >
          {t('LANGUAGE.' + languageName)}
        </span>
      }
      <ChevronDownIcon className="z-10 size-5 shrink-0 text-neutral-600 lg:hidden" />
    </button>
  );
};
