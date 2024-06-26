import { Button } from '@/components/actions';
import React from 'react';
import { ESPaceRoles } from '../../../settings/_components/space-setting/setting-items';
import { SearchInput } from '@/components/data-entry';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { Menu, Plus } from 'lucide-react';
import { Typography } from '@/components/data-display';
import { useSidebarStore } from '@/stores/sidebar.store';
export type ScriptsHeaderProps = {
  titleProps?: React.HTMLProps<HTMLSpanElement>;
  menuProps?: React.HTMLProps<HTMLDivElement>;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  allowedRoles: Record<string, Array<ESPaceRoles>>;
  myRole?: ESPaceRoles;
} & React.HTMLProps<HTMLDivElement>;

const ScriptsHeader = ({
  titleProps,
  onSearchChange,
  onCreateClick,
  menuProps,
  allowedRoles,
  myRole = ESPaceRoles.Viewer,
  ...props
}: ScriptsHeaderProps) => {
  const { t } = useTranslation('common');
  const { setOpenSidebar, openSidebar } = useSidebarStore();
  return (
    <div
      className="flex  flex-col justify-between gap-4 px-1 py-3 font-medium md:flex-row md:items-center md:px-10"
      {...props}
    >
      <div className="flex flex-row items-center justify-start" {...menuProps}>
        <Button.Icon
          onClick={() => setOpenSidebar(!openSidebar, true)}
          color="default"
          size="xs"
          variant={'ghost'}
          className={cn('md:hidden')}
        >
          <Menu />
        </Button.Icon>
        <Typography
          className=" flex flex-row items-center justify-between  space-y-0 text-base font-semibold text-neutral-800 dark:text-neutral-50"
          {...titleProps}
        >
          {t(`EXTENSION.SCRIPTS`)}
        </Typography>
      </div>
      <div
        {...props}
        className={cn(
          'flex w-full flex-col gap-2 px-2 md:max-w-[60%] md:grow md:flex-row md:justify-between md:gap-4 xl:max-w-[50%]',
          props.className,
        )}
      >
        <div className="h-12 grow">
          <SearchInput
            onChange={(
              e:
                | React.ChangeEvent<HTMLInputElement>
                | React.ChangeEvent<HTMLTextAreaElement>,
            ) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder={t('EXTENSION.SCRIPT.SEARCH')}
          />
        </div>
        <div
          className={cn('h-fit w-full md:w-fit md:flex-none ', {
            hidden: !allowedRoles.edit.includes(myRole as ESPaceRoles),
          })}
        >
          <Button
            className=" w-full min-w-fit max-md:h-12 "
            shape={'square'}
            size="md"
            startIcon={<Plus />}
            onClick={() => onCreateClick()}
          >
            {t('EXTENSION.SCRIPT.ADD_SCRIPT')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScriptsHeader;
