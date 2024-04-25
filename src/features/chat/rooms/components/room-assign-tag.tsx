'use client';

import React, { useMemo } from 'react';
import { Room } from '../types';
import { Button } from '@/components/actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { Check, Circle, Tag, XIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useSpaceStore } from '@/stores/space.store';
import { TConversationTag } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import toast from 'react-hot-toast';
import { CreateOrEditTag } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/tags-list/create-or-edit-tag';
import { useChangeTagConversation } from '../hooks/use-change-tag-conversation';
import { Spinner } from '@/components/feedback';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAuthStore } from '@/stores/auth.store';
import { getUserSpaceRole } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/space-setting/role.util';
import { ESPaceRoles } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/space-setting/setting-items';

const RoomAssignTag = ({
  room,
  onClosed,
}: {
  room: Room;
  onClosed?: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [openAddTag, setOpenAddTag] = React.useState(false);
  const { mutateAsync, isLoading, isSuccess } = useChangeTagConversation();
  const [clicked, setClicked] = React.useState<string | null>();
  const { space, setSpace } = useSpaceStore();
  const currentUser = useAuthStore((s) => s.user);
  const myRole = useMemo(() => {
    return getUserSpaceRole(currentUser, space);
  }, [space, currentUser]);
  const router = useRouter();
  const tags = space?.tags || ([] as TConversationTag[]);
  const { t } = useTranslation('common');

  const onUpdateRoomTag = async (id: TConversationTag['_id']) => {
    setClicked(id);
    const tagId = id === room.tag?._id ? null : id;
    mutateAsync({ roomId: room._id, tagId: tagId })
      .catch(() => {
        toast.error('Failed to update tag');
      })
      .finally(() => {
        onClosed && onClosed();
        setOpen(false);
        setClicked(undefined);
      });
  };
  const onRedirectToSettings = () => {
    if (!space) return;
    router.push(`${ROUTE_NAMES.SPACES}/${space._id}/settings`);
  };

  return (
    <>
      <Popover open={open}>
        <PopoverTrigger asChild>
          <div
            onClick={() => {
              setOpen(true);
            }}
            className="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none transition-colors hover:bg-primary-100 focus:bg-accent focus:text-accent-foreground"
          >
            <Tag size={16} />
            <span>{t(`CONVERSATION.TAG`)}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          onMouseLeave={() => setOpen(false)}
          className="flex h-auto flex-col  bg-white px-0 py-4"
        >
          <div className="divide-y divide-neutral-100">
            <div className="flex max-h-60 w-full flex-col overflow-y-auto">
              {tags.map(({ _id, color, name }) => {
                const isCurrent = room.tag?._id === _id;
                return (
                  <div
                    key={name}
                    className={cn(
                      'relative flex w-full min-w-full cursor-pointer flex-row items-center justify-stretch gap-3 px-4 py-2 hover:bg-neutral-100',
                      { 'bg-primary-100': isCurrent || isLoading },
                      {
                        'cursor-default bg-neutral-100':
                          isLoading && clicked === _id,
                      },
                    )}
                    onClick={() => onUpdateRoomTag(_id)}
                  >
                    <div
                      className={cn(
                        'relative size-4 rounded-full ',
                        isCurrent
                          ? 'bg-primary-500-main'
                          : 'border border-primary-300 bg-neutral-100',
                        {
                          'border-none': isLoading && clicked === _id,
                        },
                      )}
                    >
                      <Spinner
                        className={cn('invisible absolute inset-0 size-4', {
                          visible: isLoading && clicked === _id,
                        })}
                        color="white"
                      />
                      <Check
                        size={16}
                        className={cn(
                          'invisible absolute inset-0 stroke-neutral-50',
                          {
                            visible: isCurrent && !isLoading && !clicked,
                          },
                        )}
                      />
                    </div>
                    <Circle size={12} fill={color} stroke={color} />
                    <span className="text-base text-neutral-700">{name}</span>
                    <Button.Icon
                      size={'xs'}
                      variant={'ghost'}
                      color={'default'}
                      className={cn(
                        'invisible absolute inset-y-[2px] right-1',
                        {
                          visible: !isLoading && isCurrent,
                        },
                      )}
                    >
                      <XIcon />
                    </Button.Icon>
                  </div>
                );
              })}
            </div>
            <div
              className={cn('flex flex-col  items-start gap-1', {
                hidden: myRole === ESPaceRoles.Member,
              })}
            >
              <div
                className={cn(
                  'flex w-full min-w-fit  cursor-pointer flex-row items-center justify-stretch gap-3 px-4 py-2 hover:bg-neutral-100',
                )}
                onClick={() => setOpenAddTag(true)}
              >
                Add new tag
              </div>
              <div
                className={cn(
                  'flex w-full min-w-fit  cursor-pointer flex-row items-center justify-stretch gap-3 px-4 py-2 hover:bg-neutral-100',
                )}
                onClick={onRedirectToSettings}
              >
                Tags management
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {space && openAddTag && (
        <CreateOrEditTag
          spaceId={space._id}
          tags={tags}
          open={openAddTag}
          onCreateSuccess={(tags: TConversationTag[]) => {
            if (tags?.length > 0) {
              setSpace({
                ...space,
                tags: tags.filter((tag) => !tag.isDeleted),
              });
            }
          }}
          onOpenChange={(open) => setOpenAddTag(open)}
        />
      )}
    </>
  );
};

export default RoomAssignTag;
