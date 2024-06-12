import React, { useMemo } from 'react';
import { Typography } from '@/components/data-display';
import {
  Circle,
  Grip,
  GripVertical,
  Pen,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

import TableSearch from '../../../clients/clients-table/table-search';
import { Button } from '@/components/actions';
import { TConversationTag } from '../../../_components/business-spaces';
import { cn } from '@/utils/cn';
import { CreateOrEditTag } from './create-or-edit-tag';
import { ConfirmDeleteTag } from './confirm-delete-tag';
import { isEmpty } from 'lodash';
import {
  ESPaceRoles,
  SPACE_SETTING_TAB_ROLES,
} from '../space-setting/setting-items';
import { SearchInput } from '@/components/data-entry';
import { useTranslation } from 'react-i18next';

type Tag = TConversationTag;

type TagItemProps = {
  onDelete: () => void;
  onEdit: () => void;
  editAble?: boolean;
  deleteAble?: boolean;
} & Tag &
  React.HTMLAttributes<HTMLDivElement>;
const TagItem = ({
  _id,
  name,
  color,
  isReadonly,
  onEdit,
  onDelete,
  editAble,
  deleteAble,
  ...props
}: TagItemProps) => {
  return (
    <div
      className="flex w-full flex-row items-center justify-between gap-10 bg-primary-100 dark:bg-neutral-900 p-[8px_40px]"
      {...props}
    >
      <div className="flex w-full flex-row items-center justify-start  gap-10">
        <Button.Icon
          size={'xs'}
          shape={'square'}
          variant={'ghost'}
          color={'default'}
        >
          <GripVertical className="fill-neutral-500 stroke-neutral-500" />
        </Button.Icon>
        <Circle
          size={16}
          className="text-neutral-500"
          stroke={color}
          fill={color}
        />
        <Typography className="text-base capitalize text-neutral-800 dark:text-neutral-50">
          {name}
        </Typography>
      </div>
      <div
        className={cn(
          'flex min-w-10 flex-row items-center justify-end gap-2 px-4',
          { invisible: isReadonly },
        )}
      >
        <Button.Icon
          size={'xs'}
          className={editAble ? '' : 'invisible'}
          disabled={!editAble}
          color={'default'}
          onClick={onEdit}
        >
          <Pen />
        </Button.Icon>
        <Button.Icon
          size={'xs'}
          className={deleteAble ? '' : 'invisible'}
          disabled={!deleteAble}
          color={'default'}
          onClick={onDelete}
        >
          <Trash2 className="text-error" />
        </Button.Icon>
      </div>
    </div>
  );
};

enum TagModalType {
  CREATE_OR_EDIT = 'create-edit',
  DELETE = 'delete',
}
const TagsList = ({
  tags,
  spaceId,
  myRole,
}: {
  tags: Tag[];
  spaceId: string;
  myRole?: ESPaceRoles;
}) => {
  const [search, setSearch] = React.useState('');
  const { t } = useTranslation('common');
  const roles = SPACE_SETTING_TAB_ROLES.find((item) => item.name === 'tags')
    ?.roles || { view: [], edit: [], delete: [] };
  const [modalState, setModalState] = React.useState<{
    open: boolean;
    initTag: Tag | undefined;
    modalType?: TagModalType;
  }>({
    open: false,
    modalType: undefined,
    initTag: undefined,
  });

  const onSearchChange = (search: string) => {
    setSearch(search.trim());
  };
  const displayedTags = useMemo(() => {
    return (
      tags?.filter((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase()),
      ) || []
    );
  }, [tags, search]);

  return (
    <section className="flex w-full flex-col items-end gap-5 py-4">
      <div className="flex w-full flex-row items-center justify-between gap-5 px-10">
        <div className="relative w-60 md:w-96">
          <SearchInput
            className="flex-1"
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder={t('EXTENSION.TAG.SEARCH')}
          />
        </div>
        <Button
          onClick={() =>
            setModalState({
              open: true,
              initTag: undefined,
              modalType: TagModalType.CREATE_OR_EDIT,
            })
          }
          shape={'square'}
          size={'xs'}
          className={cn('', {
            hidden: !roles.edit.find((role) => role === myRole),
          })}
          disabled={!roles.edit.find((role) => role === myRole)}
          startIcon={<Plus />}
        >
          {t('EXTENSION.TAG.CREATE')}
        </Button>
      </div>
      <div className="w-full overflow-x-auto p-0">
        <div className="flex w-full flex-col gap-2">
          <p
            className={cn(
              'w-full py-1 text-center text-sm font-light italic text-neutral-500',
              !isEmpty(displayedTags) && 'hidden',
            )}
          >
            No tag founded
          </p>
          {displayedTags.map((tag) => {
            return (
              <TagItem
                key={tag._id}
                {...tag}
                editAble={!!roles.edit.find((role) => role === myRole)}
                deleteAble={!!roles.delete.find((role) => role === myRole)}
                onEdit={() =>
                  setModalState({
                    open: true,
                    initTag: tag,
                    modalType: TagModalType.CREATE_OR_EDIT,
                  })
                }
                onDelete={() =>
                  setModalState({
                    open: true,
                    initTag: tag,
                    modalType: TagModalType.DELETE,
                  })
                }
              />
            );
          })}
        </div>
      </div>
      {modalState.modalType === TagModalType.CREATE_OR_EDIT && (
        <CreateOrEditTag
          spaceId={spaceId}
          tags={tags}
          open={modalState.open}
          onOpenChange={(open) =>
            setModalState({ open, initTag: modalState.initTag })
          }
          initTag={modalState.initTag}
        />
      )}
      {modalState.initTag && modalState.modalType === TagModalType.DELETE && (
        <ConfirmDeleteTag
          onOpenChange={(open) =>
            setModalState({ open, initTag: modalState.initTag })
          }
          open={modalState.open}
          tag={modalState.initTag}
          spaceId={spaceId}
        />
      )}
    </section>
  );
};

export default TagsList;
