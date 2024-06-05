import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/data-display';
import { GripVertical, UserCog } from 'lucide-react';
import {
  changeRoleMember,
  removeMemberFromSpace,
  resendInvitation,
} from '@/services/business-space.service';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import type { DropResult, ResponderProvided } from '@hello-pangea/dnd';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { Button } from '@/components/actions';
import { useAuthStore } from '@/stores/auth.store';
import { Member } from '../../../_components/spaces-crud/sections/members-columns';
import InviteMemberModal from './invite-member-modal';
import { TSpace } from '../../../_components/business-spaces';
import {
  ESPaceRoles,
  MANAGE_SPACE_ROLES,
  SPACE_SETTING_TAB_ROLES,
} from '../space-setting/setting-items';
import { getUserSpaceRole } from '../space-setting/role.util';
import { SearchInput } from '@/components/data-entry';
import { useTranslation } from 'react-i18next';
import MemberItem from './member-item';

const Divider = ({ role }: { role: ESPaceRoles }) => {
  const { t } = useTranslation('common');
  return (
    <>
      <div
        className={cn(
          'flex w-full flex-row items-center gap-3 bg-[#fafafa] py-4 font-semibold sm:p-[20px_40px]',
        )}
      >
        <UserCog size={16} className="stroke-[3px] text-primary-500-main" />
        <Typography className="text-primary-500-main ">
          {role === ESPaceRoles.Admin
            ? t('EXTENSION.ROLE.ADMIN_ROLE')
            : t('EXTENSION.ROLE.MEMBER_ROLE')}
        </Typography>
      </div>
      <div
        className={cn('flex w-full flex-row items-center justify-start py-2 ')}
      >
        <div className="invisible !w-[50px]" />
        <div className="flex  h-auto w-[400px] flex-row items-center justify-start break-words px-3 md:w-[500px] xl:w-[800px]">
          <Typography className="text-sm  font-light text-neutral-800">
            {t('EXTENSION.MEMBER.EMAIL')}
          </Typography>
        </div>
        <Typography
          className={cn(
            'w-[100px] text-sm font-light capitalize text-gray-500',
          )}
        >
          {t('EXTENSION.MEMBER.STATUS')}
        </Typography>
      </div>
    </>
  );
};

const ReorderList = ({
  data,
  owner,
  myRole,
  isAdmin = false,
  ...props
}: {
  isAdmin?: boolean;
  myRole?: ESPaceRoles;
  data: Member[];
  owner: {
    _id: string;
    email: string;
  };
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});

  const [categories, setCategories] = useState([
    { _id: ESPaceRoles.Admin },
    { _id: ESPaceRoles.Member },
  ]);
  const [items, setItems] = useState(data);
  const { t } = useTranslation('common');
  const params = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const router = useRouter();
  const onDelete = async (member: Member) => {
    setIsLoading((prev) => ({
      ...prev,
      [member.email]: true,
    }));
    try {
      const res = await removeMemberFromSpace({
        spaceId: params?.spaceId as string,
        email: member.email,
      }).finally(() => {
        setIsLoading((prev) => ({
          ...prev,
          [member.email]: false,
        }));
      });
      if (res.data) {
        toast.success('Member removed successfully');
        router.refresh();
        return;
      }
    } catch (error) {
      console.error('Error on DeleteMember:', error);
      toast.error('Error on Delete member');
    }
  };
  const onResendInvitation = async (member: Member) => {
    setIsLoading((prev) => ({
      ...prev,
      [member.email]: true,
    }));
    try {
      const res = await resendInvitation({
        email: member.email,
        spaceId: params?.spaceId as string,
        role: member.role,
      }).finally(() => {
        setIsLoading((prev) => ({
          ...prev,
          [member.email]: false,
        }));
      });
      toast.success('Invitation resent successfully');
      router.refresh();
    } catch (error) {
      console.error('Error on ResendInvitation:', error);
      toast.error('Error on Resend invitation');
    }
    setIsLoading((prev) => ({
      ...prev,
      [member.email]: false,
    }));
  };

  const rearrangeTheList = (
    arr: any[],
    sourceIndex: number,
    destIndex: number,
  ) => {
    const arrCopy = [...arr];
    const [removed] = arrCopy.splice(sourceIndex, 1);
    arrCopy.splice(destIndex, 0, removed);
    return arrCopy;
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    if (destination.droppableId === 'Categories') {
      setCategories(
        rearrangeTheList(categories, source.index, destination.index),
      );
    } else if (destination.droppableId !== source.droppableId) {
      setItems((items) =>
        items.map((item) => {
          if (item.email === result.draggableId) {
            changeRoleMember({
              email: item.email,
              role: destination.droppableId,
              spaceId: params?.spaceId as string,
            }).then(() => {
              toast.success('Role changed successfully');
              router.refresh();
            });
            return {
              ...item,
              role: destination.droppableId,
            };
          }
          return item;
        }),
      );
    } else {
      setItems(rearrangeTheList(items, source.index, destination.index));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="Categories" type="droppableItem">
        {(provided) => (
          <div ref={provided.innerRef}>
            {categories.map((category, index) => (
              <Draggable
                draggableId={`category-${category._id}`}
                key={`category-${category._id}`}
                index={index}
              >
                {(parentProvider) => (
                  <div
                    ref={parentProvider.innerRef}
                    {...parentProvider.draggableProps}
                  >
                    <Droppable droppableId={category._id.toString()}>
                      {(provided) => (
                        <div ref={provided.innerRef}>
                          <ul
                            className={cn(
                              'list-unstyled mb-3 ',
                              'flex flex-col gap-1 overflow-x-auto  md:min-w-[400px]',
                            )}
                          >
                            <Divider role={category._id} />
                            {items
                              .filter((item) => item.role === category._id)
                              .map((item, index) => (
                                <Draggable
                                  draggableId={item.email}
                                  key={item.email.toString()}
                                  isDragDisabled={item.email === owner.email}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={cn(
                                        'grid w-full grid-cols-[48px_auto] pr-10 ',
                                        {
                                          'cursor-not-allowed':
                                            item.email === owner.email ||
                                            myRole === ESPaceRoles.Member,
                                        },
                                      )}
                                      key={item.email}
                                    >
                                      <div className="!w-fit bg-white p-1 py-2 ">
                                        <Button.Icon
                                          size={'xs'}
                                          shape={'square'}
                                          variant={'ghost'}
                                          color={'default'}
                                        >
                                          <GripVertical className="fill-neutral-500 stroke-neutral-500" />
                                        </Button.Icon>
                                      </div>

                                      <MemberItem
                                        {...item}
                                        myRole={myRole}
                                        isMe={item.email === currentUser?.email}
                                        isOwnerRow={item.email === owner.email}
                                        onResendInvitation={onResendInvitation}
                                        onDelete={onDelete}
                                        isLoading={isLoading[item.email]}
                                        {...props}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </ul>
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const MembersList = ({ space }: { space: TSpace }) => {
  const [search, setSearch] = React.useState('');
  const router = useRouter();
  const { members, owner } = space;
  const [data, setData] = useState<Member[]>(members || []);
  const { t } = useTranslation('common');
  const currentUser = useAuthStore((state) => state.user);
  const myRole = getUserSpaceRole(currentUser, space);
  const editMemberRoles =
    SPACE_SETTING_TAB_ROLES.find((setting) => setting.name === 'members')?.roles
      .edit || [];
  const onSearchChange = (search: string) => {
    setSearch(search.trim());
  };

  useEffect(() => {
    const filteredMembers = search
      ? members?.filter((member) => {
          return (
            member.email.toLowerCase().includes(search.toLowerCase()) ||
            member.role.toLowerCase().includes(search.toLowerCase())
          );
        })
      : members;
    setData(filteredMembers || []);
  }, [members, search]);

  return (
    <section className="flex w-full flex-col items-end gap-5 py-4">
      <div className="flex w-full flex-row items-center justify-between gap-5 px-10">
        <div className="relative w-60 md:w-96">
          <SearchInput
            className="flex-1"
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder={t('EXTENSION.MEMBER.SEARCH')}
          />
        </div>
        {MANAGE_SPACE_ROLES['invite-member'].includes(
          myRole as ESPaceRoles,
        ) && <InviteMemberModal space={space} myRole={myRole} />}
      </div>
      <div className="w-full">
        <ReorderList data={data} owner={owner} myRole={myRole} />
      </div>
    </section>
  );
};

export default MembersList;
