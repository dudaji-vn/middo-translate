import { CheckIcon } from 'lucide-react';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { useAuthStore } from '@/stores/auth.store';

export interface SearchListProps {
  items: User[];
  onItemClick: (user: User) => void;
  selectedItems: User[];
  itemClassName?: string;
}

export const SearchList = ({
  items,
  onItemClick,
  selectedItems,
  itemClassName,
}: SearchListProps) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  if (!items?.length) return null;
  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto">
      {items?.map((user) => {
        const isChecked = !!selectedItems.find((u) => u._id === user._id);
        if (currentUserId === user._id) return null;
        return (
          <UserItem
            key={user._id}
            isActive={isChecked}
            onClick={() => onItemClick(user)}
            wrapperClassName={itemClassName}
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
