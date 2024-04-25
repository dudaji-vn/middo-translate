import React, { useMemo } from 'react';
import { Typography } from '@/components/data-display';
import {
  GripVertical,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UserCog,
  UserRound,
  UserRoundPlus,
} from 'lucide-react';
import {
  removeMemberFromSpace,
  resendInvitation,
} from '@/services/business-space.service';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import TableSearch from '../../../statistics/_components/clients-table/table-search';
import { cn } from '@/utils/cn';
import { Button } from '@/components/actions';
import { isEmpty } from 'lodash';
import { useAuthStore } from '@/stores/auth.store';
import { Member } from '../../../_components/spaces-crud/sections/members-columns';
import InviteMemberModal from './invite-member-modal';
import { TSpace } from '../../../_components/business-spaces';
import {
  ESPaceRoles,
  MANAGE_SPACE_ROLES,
  SPACE_SETTING_TAB_ROLES,
} from '../space-setting/setting-items';
import { Badge } from '@/components/ui/badge';
import { getUserSpaceRole } from '../space-setting/role.util';

type MemberItemProps = {
  isOwnerRow: boolean;
  isLoading?: boolean;
  onDelete: (member: Member) => void;
  onResendInvitation: (member: Member) => void;
  myRole?: ESPaceRoles;
  isMe?: boolean;
} & Member &
  React.HTMLAttributes<HTMLDivElement>;
const MemberItem = ({
  role,
  isMe,
  isOwnerRow,
  email,
  myRole,
  status,
  isLoading,
  onResendInvitation,
  onDelete,
  ...props
}: MemberItemProps) => {
  const roles = SPACE_SETTING_TAB_ROLES.find(
    (setting) => setting.name === 'members',
  )?.roles;
  const deleteAble =
    !isLoading && roles?.delete.includes(myRole as ESPaceRoles) && !isOwnerRow;
  return (
    <div
      className="flex w-full flex-row items-center justify-between rounded-[12px] bg-primary-100 py-1"
      {...props}
    >
      <div className="flex w-full flex-row items-center justify-start">
        <div className="flex h-auto w-[400px] flex-row items-center justify-start gap-3 break-words rounded-l-[12px] px-3 md:w-[500px] xl:w-[800px]">
          <Typography className="text-neutral-800">{email}</Typography>
          {isOwnerRow && <Badge className="bg-primary text-white">Owner</Badge>}
          {isMe && <span className="font-light text-neutral-500">(You)</span>}
        </div>
        <div className="flex w-fit flex-row items-center  justify-start  gap-6 py-1">
          <Typography
            className={cn(
              'w-[100px] capitalize text-gray-500',
              status === 'joined' && 'text-primary-500-main',
              status === 'invited' && 'text-success-700',
            )}
          >
            {status}
          </Typography>
          <Button
            className={cn('text-neutral-500', {
              invisible:
                isOwnerRow ||
                status === 'joined' ||
                !MANAGE_SPACE_ROLES['invite-member'].includes(
                  myRole as ESPaceRoles,
                ),
            })}
            startIcon={<RotateCcw className="text-neutral-500" />}
            size={'xs'}
            shape={'square'}
            color={'default'}
            loading={isLoading}
            onClick={() =>
              onResendInvitation({
                email,
                role,
                status,
              })
            }
          >
            Resend
          </Button>
        </div>
      </div>
      <div className="min-w-10 px-4">
        <Button.Icon
          size={'xs'}
          className={deleteAble ? '' : 'invisible'}
          disabled={!deleteAble}
          color={'default'}
          onClick={() =>
            onDelete({
              email,
              role,
              status,
            })
          }
        >
          <Trash2 className="text-error" />
        </Button.Icon>
      </div>
    </div>
  );
};

const ListItems = ({
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
  const isEmptyData = isEmpty(data);

  return (
    <div className="flex flex-col gap-1 overflow-x-auto pr-10 md:min-w-[400px]">
      <p
        className={cn(
          'w-full py-1 text-center text-sm font-light italic text-neutral-500',
          !isEmptyData && 'hidden',
        )}
      >
        {isAdmin ? 'No admin founded' : 'No member founded'}
      </p>
      <div
        className={cn(
          'flex w-full flex-row items-center justify-start py-2 ',
          isEmptyData && 'hidden',
        )}
      >
        <div className="invisible !w-[50px]"></div>
        <div className="flex  h-auto w-[400px] flex-row items-center justify-start break-words px-3 md:w-[500px] xl:w-[800px]">
          <Typography className="text-sm  font-light text-neutral-800">
            Email
          </Typography>
        </div>
        <Typography
          className={cn(
            'w-[100px] text-sm font-light capitalize text-gray-500',
          )}
        >
          status
        </Typography>
      </div>
      {data?.map((member, index) => {
        return (
          <div className="grid w-full grid-cols-[48px_auto]" key={member.email}>
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
              {...member}
              myRole={myRole}
              isMe={member.email === currentUser?.email}
              isOwnerRow={member.email === owner.email}
              onResendInvitation={onResendInvitation}
              onDelete={onDelete}
              isLoading={isLoading[member.email]}
              {...props}
            />
          </div>
        );
      })}
    </div>
  );
};

const MembersList = ({ space }: { space: TSpace }) => {
  const [search, setSearch] = React.useState('');
  const { members, owner } = space;
  const currentUser = useAuthStore((state) => state.user);
  const myRole = getUserSpaceRole(currentUser, space);
  const editMemberRoles =
    SPACE_SETTING_TAB_ROLES.find((setting) => setting.name === 'members')?.roles
      .edit || [];
  const onSearchChange = (search: string) => {
    setSearch(search.trim());
  };

  const { adminsData, membersData } = useMemo(() => {
    const filteredMembers = search
      ? members?.filter((member) => {
          return (
            member.email.toLowerCase().includes(search.toLowerCase()) ||
            member.role.toLowerCase().includes(search.toLowerCase())
          );
        })
      : members;
    return filteredMembers.reduce(
      (acc, member: Member) => {
        if (member.role === ESPaceRoles.Admin) {
          acc.adminsData.push(member);
        } else {
          acc.membersData.push(member);
        }
        return acc;
      },
      {
        adminsData: [] as Member[],
        membersData: [] as Member[],
      },
    );
  }, [members, search]);

  return (
    <section className="flex w-full flex-col items-end gap-5 py-4">
      <div className="flex w-full flex-row items-center justify-end gap-5 px-10">
        <div className="relative w-60 md:w-96">
          <TableSearch
            className="min-h-[44px] w-full py-2 outline-neutral-100"
            onSearch={onSearchChange}
            search={search}
          />
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform stroke-[3px] text-neutral-700"
          />
        </div>

        {MANAGE_SPACE_ROLES['invite-member'].includes(
          myRole as ESPaceRoles,
        ) && <InviteMemberModal space={space} />}
      </div>

      <div className="flex w-full flex-col gap-1">
        <div className="flex  w-full flex-row items-center gap-3 bg-[#fafafa] py-4 font-semibold sm:p-[20px_40px]">
          <UserCog size={16} className="stroke-[3px] text-primary-500-main" />
          <Typography className="text-primary-500-main ">Admin role</Typography>
        </div>
        <ListItems data={adminsData} owner={owner} isAdmin myRole={myRole} />
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-row  items-center gap-3  bg-[#fafafa] py-4 font-semibold  sm:p-[20px_40px]">
          <UserRound size={16} className="stroke-[3px] text-primary-500-main" />
          <Typography className="text-primary-500-main">Member role</Typography>
        </div>
        <ListItems data={membersData} owner={owner} myRole={myRole} />
      </div>
    </section>
  );
};

export default MembersList;
