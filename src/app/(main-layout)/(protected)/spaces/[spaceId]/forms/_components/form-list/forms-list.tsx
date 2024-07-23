'use client';

import React, { useMemo, useState } from 'react';
import { DataTable, DataTableProps } from '@/components/ui/data-table';

import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';
import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import {
  ERoleActions,
  ESPaceRoles,
} from '../../../settings/_components/space-setting/setting-items';
import { getUserSpaceRole } from '../../../settings/_components/space-setting/role.util';
import { makeSubmissionPreviewColumns } from '../column-def/form-submission-preview-columns';
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
import { Badge } from '@/components/ui/badge';
import DownloadButton from '../../../clients/clients-table/download-button';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/actions';
import usePlatformNavigation from '@/hooks/use-platform-navigation';

const MANAGE_FORMS_ROLES: Record<ERoleActions, Array<ESPaceRoles>> = {
  edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
  delete: [ESPaceRoles.Owner],
  view: Array.from(Object.values(ESPaceRoles)),
};

const Item = ({
  _id,
  name,
  submissions,
  isUsing,
  onDelete,
  totalSubmissions,
  formFields,
  onEdit,
  goToViewForm,
}: BusinessForm & {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  goToViewForm: () => void;
}) => {
  const { t } = useTranslation('common');
  const submissionColumns = makeSubmissionPreviewColumns({
    t,
    formFields,
  });

  return (
    <div className="flex w-full flex-col  gap-3 rounded-[12px] border border-neutral-50 p-3">
      <div className="flex flex-row items-center justify-between">
        <div>
          <div
            className="flex cursor-pointer items-center"
            onClick={goToViewForm}
          >
            <p className=" font-semibold text-primary-500-main">{name}</p>
            {isUsing && (
              <Badge
                variant="default"
                className=" bg-success-100 text-xs font-semibold text-success-700 dark:bg-success-900"
              >
                {t('COMMON.IN_USE')}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {totalSubmissions || 0} submissions data
          </p>
        </div>
        <div className="flex h-10 flex-row items-center gap-2">
          <DownloadButton
            data={submissions}
            colInfo={[]}
            className="rounded-[8px] py-1"
            color={'default'}
          />
          <Button.Icon
            size={'xs'}
            className="py-1"
            color={'error'}
            variant={'ghost'}
            onClick={() => onDelete(_id)}
          >
            <Trash2 />
          </Button.Icon>
        </div>
      </div>
      <DataTable
        dividerRow
        tableHeadProps={{
          className:
            'bg-white  border-none dark:bg-background dark:text-neutral-50 text-neutral-900',
        }}
        cellProps={{
          className:
            'max-w-[200px] break-words bg-transparent first:rounded-s-xl last:rounded-e-xl py-1',
        }}
        rowProps={{
          className:
            'bg-white even:bg-primary-100 bg-primary-100 h-12 hover:bg-neutral-50  dark:bg-neutral-900  dark:hover:bg-neutral-800 dark:text-neutral-50',
        }}
        columns={submissionColumns}
        data={submissions}
      />
    </div>
  );
};

const FormsList = ({
  titleProps,
  headerProps,
  forms,
  onSearchChange,
  isLoading,
}: {
  titleProps?: React.HTMLProps<HTMLSpanElement>;
  headerProps?: Partial<FormsHeaderProps>;
  tableProps?: Partial<DataTableProps<BusinessForm, any>>;
  forms: BusinessForm[];
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
}) => {
  const [modalState, setModalState] = useState<{
    modalType: 'edit' | 'delete' | 'view';
    initialData?: BusinessForm;
  } | null>(null);

  const spaceId = useParams()?.spaceId as string;
  const { navigateTo } = usePlatformNavigation();
  const pathname = usePathname();

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
    navigateTo(`${ROUTE_NAMES.SPACES}/${spaceId}/conversations`);
  }

  const onEdit = (id: string) => {
    // TODO: implement edit form
  };

  const onView = (id: string) => {
    // TODO: implement view form
    navigateTo(`${pathname}/${id}`);
  };
  const onDeleteClick = (id: string) => {
    setModalState({
      modalType: 'delete',
      initialData: forms.find((s) => s._id === id),
    });
  };

  const onCreateFormClick = () => {
    navigateTo(`${pathname}`, new URLSearchParams({ modal: 'create' }));
  };

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
          className={cn(
            'flex max-h-[calc(100dvh-300px)] w-full flex-col gap-3  overflow-x-auto overflow-y-scroll  rounded-md px-2 py-3 md:max-h-[calc(100dvh-200px)] ',
          )}
        >
          {forms?.map((form) => {
            return (
              <Item
                key={form._id}
                {...form}
                onDelete={onDeleteClick}
                onEdit={onEdit}
                goToViewForm={() => onView(form._id)}
              />
            );
          })}
        </div>
        <DeleteFormModal
          open={modalState?.modalType === 'delete' && !!modalState?.initialData}
          formIds={[String(modalState?.initialData?._id)]}
          onclose={() => setModalState(null)}
        />
      </section>
    </>
  );
};

export default FormsList;
