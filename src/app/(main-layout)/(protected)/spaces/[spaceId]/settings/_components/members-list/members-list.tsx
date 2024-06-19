import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/data-display';
import {
  GripVertical,
  RotateCcw,
  Trash2,
  UserCog,
  UserRound,
} from 'lucide-react';
import {
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
import {
  ESPaceRoles,
  MANAGE_SPACE_ROLES,
} from '../space-setting/setting-items';
import { getUserSpaceRole } from '../space-setting/role.util';
import { SearchInput } from '@/components/data-entry';
import { useTranslation } from 'react-i18next';
import MemberItem from './member-item';
import { CategoryHeader } from './category-header';
import { ChangeMemberRoleModal } from './change-member-role-modal';
import { isEmpty } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import {
  GET_SPACE_DATA_KEY,
  useGetSpaceData,
} from '@/features/business-spaces/hooks/use-get-space-data';
import { Spinner } from '@/components/feedback';
import customToast from '@/utils/custom-toast';

const ReorderList = ({
  data,
  owner,
  myRole,
  isAdmin = false,
  spaceId,
  ...props
}: {
  isAdmin?: boolean;
  myRole?: ESPaceRoles;
  data: Member[];
  spaceId: string;
  owner: {
    _id: string;
    email: string;
  };
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{
    open: boolean;
    props?: Member & {
      onCancel: () => void;
      onSucceed: () => void;
      onFailed: () => void;
    };
  }>({
    open: false,
  });
  const disableChangeRole = myRole !== ESPaceRoles.Owner;
  const [categories, setCategories] = useState([
    { _id: ESPaceRoles.Admin },
    { _id: ESPaceRoles.Member },
  ]);
  const [items, setItems] = useState(data);
  const { t } = useTranslation('common');
  const params = useParams();
  const currentUser = useAuthStore((state) => state.user);
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
        customToast.success('Member removed successfully');
        queryClient.invalidateQueries([GET_SPACE_DATA_KEY, { spaceId }]);
        return;
      }
    } catch (error) {
      console.error('Error on DeleteMember:', error);
      customToast.error('Error on Delete member');
    }
  };
  const onResendInvitation = async (member: Member) => {
    setIsLoading((prev) => ({
      ...prev,
      [member.email]: true,
    }));
    try {
      await resendInvitation({
        email: member.email,
        spaceId: params?.spaceId as string,
        role: member.role,
      }).finally(() => {
        setIsLoading((prev) => ({
          ...prev,
          [member.email]: false,
        }));
      });
      customToast.success('Invitation resent successfully');
      queryClient.invalidateQueries([GET_SPACE_DATA_KEY, { spaceId }]);
    } catch (error) {
      console.error('Error on ResendInvitation:', error);
      customToast.error('Error on Resend invitation');
    }
    setIsLoading((prev) => ({
      ...prev,
      [member.email]: false,
    }));
  };

  useEffect(() => {
    setItems(data);
  }, [data]);

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
      setItems((prev) =>
        prev.map((item) => {
          return item.email === result.draggableId
            ? {
                ...item,
                role: destination.droppableId,
              }
            : item;
        }),
      );
      items.forEach((item, index) => {
        if (item.email === result.draggableId) {
          if (disableChangeRole) {
            const newArr = [...items];
            newArr[index].role = source.droppableId;
            setItems(items);
            customToast.error(t('EXTENSION.MEMBER.NO_EDIT_PERMISSION'));
            return;
          }
          setModal({
            open: true,
            props: {
              ...item,
              role: destination.droppableId,
              onCancel: () => {
                const newArr = [...items];
                newArr[index].role = source.droppableId;
                setItems(items);
              },
              onSucceed: () => {
                const newArr = [...items];
                newArr[index].role = destination.droppableId;
                setItems(newArr);
              },
              onFailed: () => {
                const newArr = [...items];
                newArr[index].role = source.droppableId;
                setItems(items);
              },
            },
          });
        }
      });
    } else {
      setItems(rearrangeTheList(items, source.index, destination.index));
    }
  };

  return (
    <>
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
                              <CategoryHeader role={category._id} />
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
                                        <div className="!w-fit bg-white p-1 py-2 dark:bg-background">
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
                                          isMe={
                                            item.email === currentUser?.email
                                          }
                                          isOwnerRow={
                                            item.email === owner.email
                                          }
                                          onResendInvitation={
                                            onResendInvitation
                                          }
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
      {modal.open && modal.props && (
        <ChangeMemberRoleModal
          {...modal.props}
          onClosed={() => setModal({ open: false, props: undefined })}
          _id={modal.props._id || ''}
          role={modal.props.role as ESPaceRoles}
        />
      )}
    </>
  );
};

const MembersList = () => {
  const [search, setSearch] = React.useState('');
  const spaceId = useParams()?.spaceId as string;
  const { space } = useAuthStore();
  const [data, setData] = useState<Member[]>([]);
  const { t } = useTranslation('common');
  const currentUser = useAuthStore((state) => state.user);
  const myRole = getUserSpaceRole(currentUser, space);
  const onSearchChange = (search: string) => {
    setSearch(search.trim());
  };

  useEffect(() => {
    const members = space?.members || [];
    const filteredMembers = search
      ? members?.filter((member: Member) => {
          return (
            member.email.toLowerCase().includes(search.toLowerCase()) ||
            member.role.toLowerCase().includes(search.toLowerCase())
          );
        })
      : members;
    setData(filteredMembers || []);
  }, [space, search]);

  if (isEmpty(space))
    return (
      <>
        <CategoryHeader role={ESPaceRoles.Admin} />
        <div className="flex h-10 w-full justify-center">
          <Spinner size={'md'} className="m-auto  text-neutral-100" />
        </div>
        <CategoryHeader role={ESPaceRoles.Member} />
        <div className="flex h-10 w-full justify-center">
          <Spinner size={'md'} className="m-auto text-neutral-100" />
        </div>
      </>
    );

  return (
    <section className="flex w-full flex-col items-end gap-5 py-4">
      <div className="flex w-full flex-col items-center justify-between gap-2 px-3 md:flex-row  md:gap-5 md:px-10">
        <div className="relative w-full md:max-w-96">
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
        <ReorderList
          data={data}
          owner={space.owner}
          myRole={myRole}
          spaceId={spaceId}
        />
      </div>
    </section>
  );
};

export default MembersList;
