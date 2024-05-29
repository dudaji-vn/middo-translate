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
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  allowedRoles: Record<string, Array<ESPaceRoles>>;
  myRole?: ESPaceRoles;
} & React.HTMLProps<HTMLDivElement>;

const ScriptsHeader = ({
  titleProps,
  onSearchChange,
  onCreateClick,
  allowedRoles,
  myRole = ESPaceRoles.Viewer,
  ...props
}: ScriptsHeaderProps) => {
  const { t } = useTranslation('common');
  const { setOpenSidebar, openSidebar } = useSidebarStore();
  return (
    <div
      className="flex  flex-col justify-center gap-4 px-10 py-3 font-medium md:flex-row md:items-center  md:px-10"
      {...props}
    >
      <div className="flex flex-row items-center justify-start">
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
          className=" flex flex-row items-center justify-between  space-y-0 text-base font-semibold text-neutral-800"
          {...titleProps}
        >
          {t(`EXTENSION.SCRIPT.PAGE_TITLE`)}
        </Typography>
      </div>
      <div className="flex grow justify-end gap-4">
        <div className={cn('h-12 max-w-xl grow')}>
          <SearchInput
            className="w-full"
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder={t('EXTENSION.SCRIPT.SEARCH')}
          />
        </div>
        <div
          className={cn('h-fit w-fit flex-none ', {
            hidden: !allowedRoles.edit.includes(myRole as ESPaceRoles),
          })}
        >
          <Button
            className="min-w-fit"
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
