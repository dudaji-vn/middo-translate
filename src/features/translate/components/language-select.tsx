import { Button } from '@/components/actions';
import { cn } from '@/utils/cn';
import { getCountryCode, getCountryNameByCode } from '@/utils/language-fn';
import { ChevronDownIcon, Globe2Icon } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { CircleFlag } from 'react-circle-flags';

export interface LanguageSelectProps {
  firstCode?: string;
  secondaryCode?: string;
  onChevronClick?: () => void;
  currentCode?: string;
  onChange?: (code: string) => void;
}

export const LanguageSelect = ({
  onChevronClick,
  firstCode = 'auto',
  secondaryCode = 'vi',
  currentCode,
  onChange,
}: LanguageSelectProps) => {
  return (
    <div className="flex h-[42px] w-fit items-center gap-2 ">
      <div className="flex h-full gap-2 rounded-2xl p-1 font-semibold md:bg-neutral-50">
        <LanguageItem
          onClick={() => {
            onChange?.(firstCode);
          }}
          code={firstCode}
          active={currentCode === firstCode}
        >
          Detect
        </LanguageItem>
        <LanguageItem
          onClick={() => {
            onChange?.(secondaryCode);
          }}
          active={currentCode === secondaryCode}
          code={secondaryCode}
        />
      </div>
      <Button.Icon
        className="hidden md:flex"
        onClick={onChevronClick}
        color="default"
        size="xs"
      >
        <ChevronDownIcon />
      </Button.Icon>
    </div>
  );
};

const LanguageItem = ({
  active,
  code,
  className,
  onClick,
}: {
  code: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
} & PropsWithChildren) => {
  const languageName = getCountryNameByCode(code as string) || 'Detect';
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-full w-fit items-center justify-center gap-2 rounded-xl  px-4 ',
        active
          ? 'bg-white text-primary shadow-1 '
          : 'hidden text-neutral-700 md:flex',
        className,
      )}
    >
      {code && code !== 'auto' ? (
        <CircleFlag
          countryCode={getCountryCode(code as string) as string}
          height={16}
          width={16}
        />
      ) : (
        <Globe2Icon className="h-4 w-4 text-primary" />
      )}
      <span>{languageName}</span>
    </button>
  );
};
