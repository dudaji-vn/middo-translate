import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { MoreVertical, Users2 } from 'lucide-react';

import { Button } from '@/components/actions';
import { RoomAddMember } from './room-add-member';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { useAuthStore } from '@/stores/auth';

export interface RoomMemberProps {
  members?: User[];
  adminId?: string;
}

export const RoomMember = ({ members, adminId }: RoomMemberProps) => {
  const userId = useAuthStore((state) => state.user?._id);
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-2.5 border-b p-1 pl-3">
        <div className="flex items-center gap-2">
          <Users2 width={16} height={16} /> <span>Member</span>
          <span className="text-sm text-colors-neutral-600">
            ({members?.length})
          </span>
        </div>
        <RoomAddMember />
      </div>
      <div>
        {members?.map((member) => (
          <div className="flex items-center justify-between">
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
                    <DropdownMenuItem>
                      <span>Remove</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Start conversation</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        ))}
      </div>
      <Button shape="square" color="default" size="lg" className="w-full">
        <span className="text-colors-primary-500-main"> Show all</span>
      </Button>
    </div>
  );
};
