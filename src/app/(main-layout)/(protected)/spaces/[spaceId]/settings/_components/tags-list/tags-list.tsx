import React, { useMemo } from 'react';
import { Typography } from '@/components/data-display';
import { Circle, GripVertical, Pen, Plus, Trash2 } from 'lucide-react';

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
  const { t } = useTranslation('common');
  return (
    <div
      className="flex h-fit w-full flex-row items-center justify-between gap-2  pr-3 md:pr-10"
      {...props}
    >
      <div className="!w-fit bg-white p-1  dark:bg-background">
        <Button.Icon
          size={'xs'}
          shape={'square'}
          variant={'ghost'}
          color={'default'}
        >
          <GripVertical className="fill-neutral-500 stroke-neutral-500" />
        </Button.Icon>
      </div>
      <div className="flex  w-full flex-row items-center justify-start gap-6 rounded-[12px] bg-primary-100 px-6 py-2 dark:bg-neutral-900 md:gap-16">
        <Circle
          size={16}
          className="text-neutral-500"
          stroke={color}
          fill={color}
        />
        <Typography className="line-clamp-1 max-w-full text-ellipsis text-base capitalize text-neutral-800 dark:text-neutral-50">
          {name}
        </Typography>
        <div
          className={cn(
            'flex min-w-fit grow flex-row items-center justify-end gap-2 px-2',
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
      <div className="flex w-full flex-col items-center justify-between gap-2 px-3 md:flex-row md:gap-5 md:px-10">
        <div className="relative w-full md:max-w-96">
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
          startIcon={<Plus />}
          shape={'square'}
          size={'sm'}
          className={cn(
            'flex flex-row gap-2 md:py-2 [&_svg]:size-4',
            'max-md:w-full',
            {
              hidden: !roles.edit.find((role) => role === myRole),
            },
          )}
          disabled={!roles.edit.find((role) => role === myRole)}
        >
          {t('EXTENSION.TAG.CREATE')}
        </Button>
      </div>
      <div className="w-full overflow-x-auto ">
        <div className="flex w-full flex-col gap-1">
          <div
            className={cn(
              'flex w-full flex-row items-center justify-start gap-2 py-2 pl-6 md:gap-8 md:pl-2',
            )}
          >
            <GripVertical className="invisible" />
            <div className="flex h-auto w-fit flex-row items-center justify-start break-words px-3 ">
              <Typography className="text-sm  font-light text-neutral-800 dark:text-neutral-50">
                {t('COMMON.COLOR')}
              </Typography>
            </div>
            <div className="flex h-auto w-fit flex-row items-center justify-start break-words px-3 ">
              <Typography className="text-sm  font-light text-neutral-800 dark:text-neutral-50">
                {t('EXTENSION.TAG.NAME')}
              </Typography>
            </div>
          </div>
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
