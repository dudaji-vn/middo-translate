import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { MoreVertical, Users2 } from 'lucide-react';

import { Button } from '@/components/actions';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { RoomAddMember } from './room-add-member';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { useAuthStore } from '@/stores/auth';
import { useChatBox } from '../../contexts';
import { useRemoveMember } from '../../hooks/use-remove-members';
import { useState } from 'react';

export interface RoomMemberProps {
  members: User[];
  adminId: string;
}

const INITIAL_SHOW_MEMBERS = 3;

export const RoomMember = ({ members, adminId }: RoomMemberProps) => {
  const { room } = useChatBox();
  const userId = useAuthStore((state) => state.user?._id);
  const [showMembers, setShowMembers] = useState(INITIAL_SHOW_MEMBERS);
  const isShowAll = showMembers === members?.length;
  const membersToShow = isShowAll
    ? members
    : members?.slice(0, showMembers) || [];
  const isAdmin = userId === adminId;
  const handleShowAll = () => {
    setShowMembers(members?.length || 0);
  };

  const handleHide = () => {
    setShowMembers(INITIAL_SHOW_MEMBERS);
  };
  const { mutate } = useRemoveMember();
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-2.5 border-b p-1 pl-3">
        <div className="flex items-center gap-2">
          <Users2 width={16} height={16} /> <span>Member</span>
          <span className="text-sm text-neutral-600">({members?.length})</span>
        </div>
        <RoomAddMember />
      </div>
      <div>
        {membersToShow?.map((member) => (
          <div key={member._id} className="flex items-center justify-between">
            <UserItem
              wrapperClassName="hover:!bg-background cursor-default"
              subContent={member._id === adminId ? 'Admin' : 'Member'}
              key={member._id}
              user={member}
            />
            {userId !== member._id && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button.Icon variant="ghost" color="default">
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
                        <span>Remove</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        href={`${ROUTE_NAMES.ONLINE_CONVERSATION}/${member._id}`}
                      >
                        <span>Start conversation</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        ))}
      </div>
      {!isShowAll && INITIAL_SHOW_MEMBERS < members.length && (
        <Button
          onClick={handleShowAll}
          shape="square"
          color="default"
          size="lg"
          className="w-full"
        >
          <span className="text-primary-500-main"> Show all</span>
        </Button>
      )}
      {isShowAll && INITIAL_SHOW_MEMBERS < membersToShow.length && (
        <Button
          onClick={handleHide}
          shape="square"
          color="default"
          size="lg"
          className="w-full"
        >
          <span className="text-primary-500-main">Hide</span>
        </Button>
      )}
    </div>
  );
};
