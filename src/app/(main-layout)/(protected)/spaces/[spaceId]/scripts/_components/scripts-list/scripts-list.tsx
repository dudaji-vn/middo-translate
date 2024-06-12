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
import { ChatScript, makeScriptsColumns } from '../column-def/scripts-columns';
import CreateOrEditChatScriptModal from '../script-creation/create-chat-script-modal';
import DeleteScriptModal from '../script-deletion/delete-script-modal';
import { useParams } from 'next/dist/client/components/navigation';
import ScriptsHeader, { ScriptsHeaderProps } from './scripts-header';

const MANAGE_SCRIPTS_ROLES: Record<ERoleActions, Array<ESPaceRoles>> = {
  edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
  delete: [ESPaceRoles.Owner],
  view: Array.from(Object.values(ESPaceRoles)),
};

const ScriptsList = ({
  titleProps,
  headerProps,
  tableProps,
  scripts,
  enableDeletion = true,
  search,
  onSearchChange,
  isLoading,
}: {
  titleProps?: React.HTMLProps<HTMLSpanElement>;
  headerProps?: Partial<ScriptsHeaderProps>;
  tableProps?: Partial<DataTableProps<ChatScript, any>>;
  scripts: ChatScript[];
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  enableDeletion?: boolean;
}) => {
  const [modalState, setModalState] = useState<{
    modalType: 'create' | 'edit' | 'delete' | 'view';
    initialData?: TChatScript;
  } | null>(null);
  const [rowSelection, setRowSelection] = React.useState({});
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
    if (currentScript)
      setModalState({
        modalType: 'view',
        initialData: currentScript as TChatScript,
      });
  };
  const isSomeRowCanDelete = useMemo(() => {
    return scripts?.some((s) => !s.isUsing);
  }, [scripts]);

  return (
    <section className="relative w-full">
      <ScriptsHeader
        titleProps={titleProps}
        onSearchChange={onSearchChange}
        onCreateClick={() => setModalState({ modalType: 'create' })}
        allowedRoles={MANAGE_SCRIPTS_ROLES}
        myRole={myRole}
        {...headerProps}
      />
      <div className="w-full overflow-x-auto rounded-md px-2 py-3 max-md:max-h-[65vh] md:px-10">
        <DataTable
          dividerRow
          tableInitialParams={{
            onRowSelectionChange: (selectedRows: any) => {
              setRowSelection(selectedRows);
            },
            state: {
              rowSelection,
            },
            enableRowSelection(row) {
              return !row.original?.isUsing;
            },
            getRowId: (row) => row._id,
          }}
          columns={makeScriptsColumns({
            t,
            isSomeRowCanDelete,
            onEdit,
            onView,
            enableDeletion,
            singleRowSelection:
              tableProps?.tableInitialParams?.enableMultiRowSelection === false,
            onDeleteRowSelections: () => {
              setModalState({ modalType: 'delete' });
            },
          })}
          data={scripts}
          tableHeadProps={{
            className: 'bg-white  border-none dark:bg-background dark:text-neutral-50',
          }}
          cellProps={{
            className:
              'max-w-[200px] break-words bg-transparent first:rounded-s-xl last:rounded-e-xl py-1',
          }}
          rowProps={{
            className:
              'bg-white even:bg-primary-100 bg-primary-100 h-12 hover:bg-neutral-50  dark:bg-neutral-900  dark:hover:bg-neutral-800 dark:text-neutral-50',
          }}
          loading={isLoading}
          skeletonsRows={DEFAULT_CLIENTS_PAGINATION.limit}
          {...tableProps}
        />
      </div>
      <CreateOrEditChatScriptModal
        open={
          modalState?.modalType === 'create' ||
          modalState?.modalType === 'edit' ||
          modalState?.modalType === 'view'
        }
        viewOnly={modalState?.modalType === 'view'}
        currentScript={modalState?.initialData!}
        onClose={() => setModalState(null)}
      />
      <DeleteScriptModal
        open={modalState?.modalType === 'delete' && !!rowSelection}
        scriptIds={Object.keys(rowSelection)}
        onclose={() => setModalState(null)}
      />
    </section>
  );
};

export default ScriptsList;
