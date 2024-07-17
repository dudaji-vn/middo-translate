'use client';

import React, { useMemo, useState } from 'react';
import { DataTable, DataTableProps } from '@/components/ui/data-table';

import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';
import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import {
  ERoleActions,
  ESPaceRoles,
} from '../../../settings/_components/space-setting/setting-items';
import { getUserSpaceRole } from '../../../settings/_components/space-setting/role.util';
import { makeFormsColumns } from '../column-def/forms-columns';
import { useParams } from 'next/dist/client/components/navigation';
import FormsHeader, { FormsHeaderProps } from './form-header';
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { BusinessForm } from '@/types/forms.type';
import DeleteFormModal from '../form-deletion/delete-form-modal';
import { isEmpty } from 'lodash';

const MANAGE_FORMS_ROLES: Record<ERoleActions, Array<ESPaceRoles>> = {
  edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
  delete: [ESPaceRoles.Owner],
  view: Array.from(Object.values(ESPaceRoles)),
};

const FormsList = ({
  titleProps,
  headerProps,
  tableProps,
  forms,
  enableDeletion = true,
  search,
  onSearchChange,
  isLoading,
  tableWrapperProps,
}: {
  titleProps?: React.HTMLProps<HTMLSpanElement>;
  headerProps?: Partial<FormsHeaderProps>;
  tableProps?: Partial<DataTableProps<BusinessForm, any>>;
  forms: BusinessForm[];
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  enableDeletion?: boolean;
  tableWrapperProps?: React.HTMLProps<HTMLDivElement>;
}) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [modalState, setModalState] = useState<{
    modalType: 'edit' | 'delete' | 'view';
    initialData?: BusinessForm;
  } | null>(null);

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true },
    { id: 'createdAt', desc: true },
  ]);
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
    !MANAGE_FORMS_ROLES.edit.includes(myRole as ESPaceRoles)
  ) {
    router.push(`${ROUTE_NAMES.SPACES}/${spaceId}/conversations`);
  }

  const onEdit = (id: string) => {
    // TODO: implement edit form
  };
  const onView = (id: string) => {
    // TODO: implement view form
  };

  const onCreateFormClick = () => {
    router.push(`${ROUTE_NAMES.SPACES}/${spaceId}/forms?modal=create`);
  };

  const isSomeRowCanDelete = useMemo(() => {
    return forms?.some((s) => !s.isUsing);
  }, [forms]);

  return (
    <>
      <FormsHeader
        titleProps={titleProps}
        onSearchChange={onSearchChange}
        onCreateClick={onCreateFormClick}
        allowedRoles={MANAGE_FORMS_ROLES}
        myRole={myRole}
        {...headerProps}
      />
      <section
        className={cn(
          'relative w-full',
          isEmpty(forms) && !isLoading && 'hidden',
        )}
      >
        <div
          {...tableWrapperProps}
          className={cn(
            'max-h-[calc(100dvh-300px)] w-full  overflow-x-auto overflow-y-scroll  rounded-md px-2 py-3 md:max-h-[calc(100dvh-200px)] ',
            tableWrapperProps?.className,
          )}
        >
          <DataTable
            dividerRow
            tableInitialParams={{
              onRowSelectionChange: (selectedRows: any) => {
                setRowSelection(selectedRows);
              },
              state: {
                rowSelection,
                sorting,
              },
              onSortingChange: setSorting,
              getCoreRowModel: getCoreRowModel(),
              getSortedRowModel: getSortedRowModel(),
              enableRowSelection(row) {
                return !row.original?.isUsing;
              },
              getRowId: (row) => row._id,
            }}
            columns={makeFormsColumns({
              t,
              isSomeRowCanDelete,
              onEdit,
              onView,
              enableDeletion,
              singleRowSelection:
                tableProps?.tableInitialParams?.enableMultiRowSelection ===
                false,
              onDeleteRowSelections: () => {
                setModalState({ modalType: 'delete' });
              },
            })}
            data={forms}
            tableHeadProps={{
              className:
                'bg-white  border-none dark:bg-background dark:text-neutral-50',
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
        <DeleteFormModal
          open={modalState?.modalType === 'delete' && !!rowSelection}
          formIds={Object.keys(rowSelection)}
          onclose={() => setModalState(null)}
        />
      </section>
    </>
  );
};

export default FormsList;
