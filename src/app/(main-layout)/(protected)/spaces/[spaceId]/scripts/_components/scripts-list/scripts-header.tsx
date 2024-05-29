import { Button } from '@/components/actions';
import React from 'react';
import { ESPaceRoles } from '../../../settings/_components/space-setting/setting-items';
import { SearchInput } from '@/components/data-entry';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
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
  return (
    <div
      className="flex  flex-col justify-center gap-4 px-10 py-3 font-medium md:flex-row md:items-center  md:px-10"
      {...props}
    >
      <span {...titleProps}>Scripts Management</span>
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
            Add&nbsp;
            <span className="max-md:hidden">New Script</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScriptsHeader;
