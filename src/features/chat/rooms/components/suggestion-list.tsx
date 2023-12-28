import { CheckIcon } from 'lucide-react';
import { Typography } from '@/components/data-display';
import { UserItem } from '@/features/users/components';
import { useGetUsersRecChat } from '@/features/recommendation/hooks/use-get-users-rec-chat';
import { useGroupCreate } from './group-create-side/context';

export interface SuggestionListProps {}

export const SuggestionList = (props: SuggestionListProps) => {
  const { data } = useGetUsersRecChat();
  const { selectedUsers, handleSelectUser, searchUsers } = useGroupCreate();

  if (searchUsers.length > 0) return null;
  return (
    <div className="mt-3 flex w-full flex-1 flex-col overflow-y-auto">
      <Typography variant="h5" className="pb-3 pl-3 font-normal opacity-60">
        Suggestion
      </Typography>
      {data?.map((user) => {
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
