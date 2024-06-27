import { Button } from '@/components/actions';
import { SearchInput } from '@/components/data-entry';
import { searchApi } from '@/features/search/api';
import { UserItem } from '@/features/users/components';
import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import customToast from '@/utils/custom-toast';
import { useMutation } from '@tanstack/react-query';
import { AtSignIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Station } from '../types/station.types';

export const AddByUsername = ({
  station,
  selectedUsers,
  setSelectedUsers,
}: {
  station: Station;
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) => {
  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation('common');
  const { mutate } = useMutation({
    mutationFn: searchApi.username,
    onSuccess: (data) => {
      const isEmpty = data.length === 0;
      if (isEmpty) {
        customToast.error(t('MESSAGE.ERROR.USER_NOT_FOUND'));
        return;
      }
      const userRes = data[0];
      if (userRes._id === user?._id) {
        customToast.error(t('MESSAGE.ERROR.CANT_ADD_YOURSELF'));
        return;
      }
      handleSelectUser(userRes);
    },
  });

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

  const handleSearch = () => {
    mutate({
      q: searchTerm,
    });
  };
  return (
    <div>
      <div className={cn(selectedUsers.length > 0 && 'border-b pb-4')}>
        <div className="flex items-center gap-2">
          <SearchInput
            leftElement={
              <div className="my-auto flex h-full shrink-0 items-center justify-center pl-2 text-neutral-800">
                <AtSignIcon className="size-5" />
              </div>
            }
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('COMMON.USERNAME')}
            onEnter={handleSearch}
            autoFocus
          />
          <Button
            onClick={handleSearch}
            shape="square"
            size="xs"
            className="h-11"
            color="secondary"
            endIcon={<PlusIcon className="size-5" />}
          >
            {t('COMMON.ADD')}
          </Button>
        </div>
      </div>
      <div className="-mx-5 max-h-[256px] overflow-y-auto px-3 pt-3">
        <SearchList
          items={selectedUsers ?? []}
          onItemClick={handleSelectUser}
          selectedItems={selectedUsers}
          itemClassName="!p-3"
        />
      </div>
    </div>
  );
};

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
    <div className="rounded-xl bg-primary-100">
      <div className="p-3">
        <span className="text-sm font-semibold text-neutral-600">
          Added list
        </span>
      </div>
      <div className="flex w-full flex-1 flex-col overflow-y-auto ">
        {items?.map((user) => {
          const isChecked = !!selectedItems.find((u) => u._id === user._id);
          if (currentUserId === user._id) return null;
          return (
            <UserItem
              key={user._id}
              isActive={isChecked}
              wrapperClassName={itemClassName}
              user={user}
              rightElement={
                <Button.Icon
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick(user);
                  }}
                  size="xs"
                  variant="ghost"
                  color="error"
                >
                  <Trash2Icon />
                </Button.Icon>
              }
            />
          );
        })}
      </div>
    </div>
  );
};
