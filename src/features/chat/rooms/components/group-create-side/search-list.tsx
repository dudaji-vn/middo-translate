import { CheckIcon } from 'lucide-react';
import { UserItem } from '@/features/users/components';
import { useAuthStore } from '@/stores/auth';
import { useGroupCreate } from './context';
import { useMemo } from 'react';

export interface GroupCreateSearchListProps {}

export const GroupCreateSearchList = (props: GroupCreateSearchListProps) => {
  const user = useAuthStore((state) => state.user);
  const { searchUsers, selectedUsers, handleSelectUser } = useGroupCreate();
  const filteredUsers = useMemo(() => {
    return searchUsers?.filter((u) => u._id !== user!._id);
  }, [searchUsers, user]);

  if (!filteredUsers?.length) return null;
  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto">
      {filteredUsers?.map((user) => {
        const isChecked = !!selectedUsers.find((u) => u._id === user._id);
        return (
          <UserItem
            key={user._id}
            isActive={isChecked}
            onClick={() => handleSelectUser(user)}
            user={user}
            rightElement={
              <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stroke p-[0.5px]">
                {isChecked && (
                  <CheckIcon className="h-3 w-3 rounded-full bg-primary text-background" />
                )}
              </div>
            }
          />
        );
      })}
    </div>
  );
};
