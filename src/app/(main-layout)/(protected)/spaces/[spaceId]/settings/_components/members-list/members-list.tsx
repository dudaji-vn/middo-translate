import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/data-display';
import { GripVertical, UserCog } from 'lucide-react';
import {
  changeRole,
  removeMemberFromSpace,
  resendInvitation,
} from '@/services/business-space.service';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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
import { getUserSpaceRole } from '../space-setting/role.util';
import { SearchInput } from '@/components/data-entry';
import { useTranslation } from 'react-i18next';
import { Reorder } from 'framer-motion';
import MemberItem from './member-item';

const Divider = ({ isAdmin }: { isAdmin?: boolean }) => {
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
          {isAdmin
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
  const isEmptyData = isEmpty(data);

  return (
    <div className="flex flex-col gap-1 overflow-x-auto md:min-w-[400px]">
      <Divider isAdmin />
      {data?.map((member, index) => {
        if (member.role === 'divider') {
          return (
            <Reorder.Item key={member.email} value={member.email}>
              <Divider />
            </Reorder.Item>
          );
        }
        return (
          <Reorder.Item key={member.email} value={member.email}>
            <div
              className="grid w-full grid-cols-[48px_auto] pr-10"
              key={member.email}
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
          </Reorder.Item>
        );
      })}
    </div>
  );
};

const MembersList = ({ space }: { space: TSpace }) => {
  const [search, setSearch] = React.useState('');
  const router = useRouter();
  const { members, owner } = space;
  const [order, setOrder] = useState(members || []);
  const { t } = useTranslation('common');
  const currentUser = useAuthStore((state) => state.user);
  const myRole = getUserSpaceRole(currentUser, space);
  const editMemberRoles =
    SPACE_SETTING_TAB_ROLES.find((setting) => setting.name === 'members')?.roles
      .edit || [];
  const onSearchChange = (search: string) => {
    setSearch(search.trim());
  };
  const onMemberRoleChange = (id: string, role: ESPaceRoles) => {
    console.log('CHANG ROLE OF id', id, 'role', role);
    changeRole({
      email: id,
      role,
      spaceId: space._id,
    })
      .then(() => {
        toast.success('Role changed successfully');
        router.refresh();
      })
      .catch((err) => {
        console.error('Error on changeRole:', err);
        toast.error('Error on change role');
      });
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
    const sortedMembers = filteredMembers?.sort((a, b) =>
      a.role === ESPaceRoles.Owner || a.role === ESPaceRoles.Admin ? 1 : -1,
    );
    const { ads, mems } = sortedMembers.reduce(
      (acc, member) => {
        if (member.role === ESPaceRoles.Admin) {
          acc.ads.push(member);
        } else {
          acc.mems.push(member);
        }
        return acc as { ads: Member[]; mems: Member[] };
      },
      { ads: [] as Member[], mems: [] as Member[] },
    );
    setOrder([...ads, { email: 'divider', role: 'divider' }, ...mems]);
  }, [members, search]);

  const onReorder = (values: string[]) => {
    const oldDividerIndex = order.findIndex(
      (member) => member.email === 'divider',
    );
    const newDividerIndex = values.findIndex((email) => email === 'divider');
    const { membersAboveDivider, membersBelowDivider } = values.reduce(
      (acc, email, index) => {
        if (index < newDividerIndex) {
          acc.membersAboveDivider.push(email);
        } else if (index > newDividerIndex) {
          acc.membersBelowDivider.push(email);
        }
        return acc;
      },
      {
        membersAboveDivider: [] as string[],
        membersBelowDivider: [] as string[],
      },
    );
    console.log('membersAboveDivider', membersAboveDivider);
    console.log('membersBelowDivider', membersBelowDivider);
    const memberBecomeAdmin = membersAboveDivider.find((email) => {
      const member = members.find((member) => member.email === email);
      return member?.role === ESPaceRoles.Member;
    });
    const adminBecomeMember = membersBelowDivider.find((email) => {
      const member = members.find((member) => member.email === email);
      return (
        member?.role === ESPaceRoles.Admin && member?.email !== owner.email
      );
    });
    console.log(
      'memberBecomeAdmin',
      memberBecomeAdmin,
      newDividerIndex,
      oldDividerIndex,
    );
    console.log('adminBecomeMember', adminBecomeMember);
    if (memberBecomeAdmin && newDividerIndex > oldDividerIndex) {
      onMemberRoleChange(memberBecomeAdmin, ESPaceRoles.Admin);
      setOrder(
        values.map(
          (email) => order.find((member) => member.email === email) as Member,
        ),
      );
    } else if (adminBecomeMember && newDividerIndex < oldDividerIndex) {
      onMemberRoleChange(adminBecomeMember, ESPaceRoles.Member);
      setOrder(
        values.map(
          (email) => order.find((member) => member.email === email) as Member,
        ),
      );
    }
  };
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

      <Reorder.Group
        values={order.map((member) => member.email)}
        onReorder={onReorder}
        className=" w-full"
      >
        <ListItems data={order} owner={owner} myRole={myRole} />
      </Reorder.Group>
    </section>
  );
};

export default MembersList;
