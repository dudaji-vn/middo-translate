import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconWrapper,
} from '@/components/data-display';
import { MoreVertical, Users2 } from 'lucide-react';

import { Button } from '@/components/actions';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { RoomAddMember } from './room-add-member';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { useAuthStore } from '@/stores/auth.store';
import { useChatBox } from '../../contexts';
import { useRemoveMember } from '../../hooks/use-remove-members';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface RoomMemberProps {
  members: User[];
  pendingMembers?: User[];
  rejectedMembers?: User[];
  adminId: string;
}

type MemberWithStatus = User & {
  inviteStatus: 'none' | 'pending' | 'rejected';
};

const INITIAL_SHOW_MEMBERS = 3;

export const RoomMember = ({
  members,
  adminId,
  pendingMembers,
  rejectedMembers,
}: RoomMemberProps) => {
  const { room } = useChatBox();
  const userId = useAuthStore((state) => state.user?._id);
  const [showMembers, setShowMembers] = useState(INITIAL_SHOW_MEMBERS);
  const isShowAll = showMembers === members?.length;
  const { t } = useTranslation('common');
  const isAdmin = userId === adminId;
  const handleShowAll = () => {
    setShowMembers(members?.length || 0);
  };

  const handleHide = () => {
    setShowMembers(INITIAL_SHOW_MEMBERS);
  };
  const { mutate } = useRemoveMember();

  const membersToShow = useMemo(() => {
    const combinedMembers: MemberWithStatus[] = members?.map((member) => ({
      ...member,
      inviteStatus: 'none',
    }));
    pendingMembers?.forEach((member) => {
      const index = combinedMembers.findIndex((m) => m._id === member._id);
      if (index !== -1) {
        combinedMembers[index].inviteStatus = 'pending';
      } else {
        combinedMembers.push({
          ...member,
          inviteStatus: 'pending',
        });
      }
    });
    rejectedMembers?.forEach((member) => {
      const index = combinedMembers.findIndex((m) => m._id === member._id);
      if (index !== -1) {
        combinedMembers[index].inviteStatus = 'rejected';
      } else {
        combinedMembers.push({
          ...member,
          inviteStatus: 'rejected',
        });
      }
    });

    const uniqueMembers = combinedMembers?.filter(
      (member, index, self) =>
        index === self.findIndex((m) => m._id === member._id),
    );
    if (isShowAll) return uniqueMembers;
    return uniqueMembers?.slice(0, showMembers) || [];
  }, [isShowAll, members, pendingMembers, rejectedMembers, showMembers]);

  return (
    <div className="mt-5 bg-white pb-3 dark:bg-background">
      <div className="flex items-center justify-between gap-2.5  p-3 pl-3">
        <div className="flex items-center gap-2">
          <IconWrapper>
            <Users2 />
          </IconWrapper>
          <span>{t('CONVERSATION.MEMBERS')}</span>
          <span className="text-sm text-neutral-600">({members?.length})</span>
        </div>
        <RoomAddMember />
      </div>
      <div>
        {membersToShow?.map((member) => {
          const isCurrentUser = member._id === userId;
          let subContent =
            member._id === adminId
              ? t('CONVERSATION.ADMIN')
              : t('CONVERSATION.MEMBERS');

          if (isCurrentUser) subContent += ` (${t('CONVERSATION.YOU')})`;

          return (
            <div key={member._id} className="flex items-center justify-between">
              <UserItem
                wrapperClassName="hover:!bg-background flex-1 cursor-default"
                subContent={subContent}
                key={member._id}
                user={member}
                rightElement={
                  <div className="ml-auto">
                    {member.inviteStatus === 'pending' ? (
                      <span className="rounded bg-neutral-50 p-0.5 px-1 text-xs text-neutral-600 whitespace-nowrap">
                        {t('COMMON.PENDING')}
                      </span>
                    ) : member.inviteStatus === 'rejected' ? (
                      <span className="rounded bg-error-100/20 p-0.5 px-1 text-xs text-error">
                        {t('COMMON.REJECTED')}
                      </span>
                    ) : undefined}
                  </div>
                }
              />
              {userId !== member._id && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button.Icon size="xs" variant="ghost" color="default">
                        <MoreVertical />
                      </Button.Icon>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() => {
                            mutate({
                              roomId: room._id,
                              userId: member._id,
                            });
                          }}
                        >
                          <span>{t('COMMON.REMOVE')}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`${ROUTE_NAMES.ONLINE_CONVERSATION}/${member._id}`}
                        >
                          <span>{t('CONVERSATION.START')}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          );
        })}
      </div>
      {!isShowAll && INITIAL_SHOW_MEMBERS < members.length && (
        <div className="px-3">
          <Button
            onClick={handleShowAll}
            shape="square"
            color="default"
            size="md"
            className="w-full"
          >
            {t('CONVERSATION.SHOW_ALL')}
          </Button>
        </div>
      )}
      {isShowAll && INITIAL_SHOW_MEMBERS < membersToShow.length && (
        <div className="px-3">
          <Button
            onClick={handleHide}
            shape="square"
            color="default"
            size="md"
            className="w-full"
          >
            {t('CONVERSATION.HIDE')}
          </Button>
        </div>
      )}
    </div>
  );
};
