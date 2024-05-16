'use client';

import React, { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';

import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';
import { useTranslation } from 'react-i18next';
import {
  ChatScript,
  scriptsColumns,
} from './_components/column-def/scripts-columns';
import { useGetConversationScripts } from '@/features/conversation-scripts/hooks/use-get-conversation-scripts';
import { SearchInput } from '@/components/data-entry';
import CreateOrEditChatScriptModal from './_components/script-creation/create-chat-script-modal';
import { cn } from '@/utils/cn';
import { getUserSpaceRole } from '../settings/_components/space-setting/role.util';
import { useAuthStore } from '@/stores/auth.store';
import {
  ERoleActions,
  ESPaceRoles,
} from '../settings/_components/space-setting/setting-items';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Button } from '@/components/actions';
import { Plus } from 'lucide-react';
import DeleteScriptModal from './_components/script-deletion/delete-script-modal';
import { TChatFlow, TChatScript } from '@/types/scripts.type';

const MANAGE_SCRIPTS_ROLES: Record<ERoleActions, Array<ESPaceRoles>> = {
  edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
  delete: [ESPaceRoles.Owner],
  view: Array.from(Object.values(ESPaceRoles)),
};

const Page = ({
  params: { spaceId },
}: {
  params: {
    spaceId: string;
  };
}) => {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const [modalState, setModalState] = useState<{
    modalType: 'create' | 'edit' | 'delete';
    initialData?: TChatScript;
  } | null>(null);
  const { data, isLoading } = useGetConversationScripts({
    search,
    spaceId,
  });

  const { user: currentUser, space } = useAuthStore();
  const myRole = useMemo(() => {
    return getUserSpaceRole(currentUser, space);
  }, [currentUser, space]);
  const scripts: ChatScript[] = data?.items || [];
  const onSearchChange = (search: string) => {
    setSearch(search);
  };

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
      <div className="flex  flex-col justify-center gap-4  px-4 py-3 font-medium md:flex-row md:items-center md:px-10">
        <span>Scripts Management</span>
        <em className="max-md:hidden md:w-1/6 xl:w-1/5" />
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
          columns={scriptsColumns({
            onDelete,
            onEdit,
            onView,
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
        script={modalState?.initialData!}
        onclose={() => setModalState(null)}
      />
    </section>
  );
};

export default Page;
