'use client';

import React, { useMemo, useState } from 'react';
import { DataTableProps } from '@/components/ui/data-table';

import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { usePathname } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import {
  ERoleActions,
  ESPaceRoles,
} from '../../../settings/_components/space-setting/setting-items';
import { getUserSpaceRole } from '../../../settings/_components/space-setting/role.util';
import { useParams } from 'next/dist/client/components/navigation';
import FormsHeader, { FormsHeaderProps } from './form-header';
import { BusinessForm } from '@/types/forms.type';
import DeleteFormModal from '../form-deletion/delete-form-modal';
import { isEmpty } from 'lodash';
import usePlatformNavigation from '@/hooks/use-platform-navigation';
import { Submissions } from '../../[formId]/_components';

const MANAGE_FORMS_ROLES: Record<ERoleActions, Array<ESPaceRoles>> = {
  edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
  delete: [ESPaceRoles.Owner],
  view: Array.from(Object.values(ESPaceRoles)),
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
          'relative w-full md:px-10',
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
              <Submissions
                key={form._id}
                {...form}
                isPreview
                onDelete={onDeleteClick}
                viewDetailForm={() => onView(form._id)}
                className="className rounded-[12px]  border border-neutral-50 p-3"
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
