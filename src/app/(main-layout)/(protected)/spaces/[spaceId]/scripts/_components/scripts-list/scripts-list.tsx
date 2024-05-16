'use client';

import React, { useMemo, useState } from 'react';
import { DataTable, DataTableProps } from '@/components/ui/data-table';

import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';
import { useTranslation } from 'react-i18next';

import { useGetConversationScripts } from '@/features/conversation-scripts/hooks/use-get-conversation-scripts';
import { SearchInput } from '@/components/data-entry';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Button } from '@/components/actions';
import { Plus } from 'lucide-react';
import { TChatScript } from '@/types/scripts.type';
import {
  ERoleActions,
  ESPaceRoles,
} from '../../../settings/_components/space-setting/setting-items';
import { getUserSpaceRole } from '../../../settings/_components/space-setting/role.util';
import { ChatScript, scriptsColumns } from '../column-def/scripts-columns';
import CreateOrEditChatScriptModal from '../script-creation/create-chat-script-modal';
import DeleteScriptModal from '../script-deletion/delete-script-modal';
import { useParams } from 'next/dist/client/components/navigation';

const MANAGE_SCRIPTS_ROLES: Record<ERoleActions, Array<ESPaceRoles>> = {
  edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
  delete: [ESPaceRoles.Owner],
  view: Array.from(Object.values(ESPaceRoles)),
};

const ScriptsList = ({
  titleProps,
  headerProps,
  enableSelectAll = true,
  tableProps,
  scripts,
  search,
  onSearchChange,
  isLoading,

}: {
  titleProps?: React.HTMLProps<HTMLSpanElement>;
  headerProps?: React.HTMLProps<HTMLDivElement>;
  tableProps?: Partial<DataTableProps<ChatScript, any>>;
    enableSelectAll?: boolean;
    scripts: ChatScript[];
    search: string;
    onSearchChange: (value: string) => void;
    isLoading: boolean;

}) => {
  const [modalState, setModalState] = useState<{
    modalType: 'create' | 'edit' | 'delete';
    initialData?: TChatScript;
  } | null>(null);
  const [rowSelection, setRowSelection] = React.useState({});
  // const [search, setSearch] = useState('');
  const router = useRouter();
  const spaceId = useParams()?.spaceId as string;

  const { user: currentUser, space } = useAuthStore();
  const myRole = useMemo(() => {
    return getUserSpaceRole(currentUser, space);
  }, [currentUser, space]);

  const { t } = useTranslation('common');
  if (
    space &&
    currentUser &&
    !MANAGE_SCRIPTS_ROLES.edit.includes(myRole as ESPaceRoles)
  ) {
    router.push(`${ROUTE_NAMES.SPACES}/${spaceId}/conversations`);
  }

  const onDelete = (id: string) => {
    const script = scripts.find((s) => s._id === id);
    if (script) {
      setModalState({
        modalType: 'delete',
        initialData: script as TChatScript,
      });
    }
  };
  const onEdit = (id: string) => {
    const currentScript = scripts.find((s) => s._id === id);
    if (currentScript)
      setModalState({
        modalType: 'edit',
        initialData: currentScript as TChatScript,
      });
  };
  const onView = (id: string) => {
    const currentScript = scripts.find((s) => s._id === id);
    console.log('View', currentScript);
  };

  return (
    <section className="relative w-full">
      <div
        {...headerProps}
        className="flex  flex-col justify-center gap-4  px-4 py-3 font-medium md:flex-row md:items-center md:px-10"
      >
        <span {...titleProps}>Scripts Management</span>
        <div className="flex grow gap-4">
          <div className="h-12 grow">
            <SearchInput
              className="w-full"
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange('')}
              placeholder={t('BUSINESS.SCRIPT.SEARCH')}
            />
          </div>
          <div
            className={cn('h-fit w-fit flex-none ', {
              hidden: !MANAGE_SCRIPTS_ROLES.edit.includes(
                myRole as ESPaceRoles,
              ),
            })}
          >
            <Button
              className="min-w-fit"
              shape={'square'}
              size="md"
              startIcon={<Plus />}
              onClick={() => setModalState({ modalType: 'create' })}
            >
              Add&nbsp;
              <span className="max-md:hidden">New Script</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-md px-10 py-3">
        <DataTable
          dividerRow
          tableInitialParams={{
            onRowSelectionChange: (selectedRows: any) => {
              setRowSelection(selectedRows);
            },
            state: {
              rowSelection,
            },
          }}
          columns={scriptsColumns({
            onDelete,
            onEdit,
            onView,
            enableSelectAll,
          })}
          data={scripts}
          tableHeadProps={{
            className: 'bg-white  border-none',
          }}
          cellProps={{
            className:
              'max-w-[200px] break-words bg-transparent first:rounded-s-xl last:rounded-e-xl py-1',
          }}
          rowProps={{
            className:
              'bg-white even:bg-primary-100 bg-primary-100 h-12 hover:bg-neutral-50',
          }}
          loading={isLoading}
          skeletonsRows={DEFAULT_CLIENTS_PAGINATION.limit}
          {...tableProps}
        />
      </div>
      <CreateOrEditChatScriptModal
        open={
          modalState?.modalType === 'create' || modalState?.modalType === 'edit'
        }
        currentScript={modalState?.initialData!}
        onClose={() => setModalState(null)}
      />
      <DeleteScriptModal
        open={modalState?.modalType === 'delete' && !!modalState?.initialData}
        script={modalState?.initialData}
        onclose={() => setModalState(null)}
      />
    </section>
  );
};

export default ScriptsList;
