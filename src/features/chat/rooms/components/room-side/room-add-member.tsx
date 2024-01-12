import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/feedback';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/actions';
import { SearchInput } from '@/components/data-entry';
import { SearchList } from '../search-list';
import { SelectedList } from '../selected-list';
import { User } from '@/features/users/types';
import { UserPlus2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { searchApi } from '@/features/search/api';
import { useAddMembers } from '../../hooks/use-add-members';
import { useAuthStore } from '@/stores/auth.store';
import { useChatBox } from '../../contexts';
import { useSearch } from '@/hooks/use-search';

export interface RoomAddMemberProps {}

export const RoomAddMember = (props: RoomAddMemberProps) => {
  const { room } = useChatBox();
  const { data, setSearchTerm } = useSearch<User[]>(
    searchApi.users,
    'add-member',
  );
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { mutate } = useAddMembers();
  const user = useAuthStore((state) => state.user);
  const filteredUsers = useMemo(() => {
    return data?.filter((u) => {
      if (u._id === user?._id) return false;
      if (room.participants.some((p) => p._id === u._id)) return false;
      return true;
    });
  }, [data, room.participants, user?._id]);

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUsers((prev) => {
      let newSelectedUsers = [];
      const index = prev.findIndex((u) => u._id === user._id);
      if (index === -1) {
        newSelectedUsers = [...prev, user];
      } else {
        newSelectedUsers = [...prev.slice(0, index), ...prev.slice(index + 1)];
      }

      return newSelectedUsers;
    });
  }, []);
  const handleUnSelectUser = useCallback((user: User) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
  }, []);

  const handleSubmit = () => {
    mutate({
      roomId: room._id,
      userIds: selectedUsers.map((u) => u._id),
    });
    setSelectedUsers([]);
  };
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button.Icon variant="ghost">
            <UserPlus2 width={16} height={16} />
          </Button.Icon>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add member</AlertDialogTitle>
            <div className={cn(selectedUsers.length > 0 && 'border-b pb-4')}>
              <SearchInput
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
              />
              <SelectedList
                items={selectedUsers}
                onItemClick={handleUnSelectUser}
              />
            </div>
            <div className="-mx-5 max-h-[256px] overflow-y-auto pt-4">
              <SearchList
                items={filteredUsers ?? []}
                onItemClick={handleSelectUser}
                selectedItems={selectedUsers}
                itemClassName="!px-5"
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="mr-4">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={selectedUsers.length === 0}
              onClick={handleSubmit}
            >
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
