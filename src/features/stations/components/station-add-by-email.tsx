import { Button } from '@/components/actions';
import { SearchInput } from '@/components/data-entry';
import { UserItem } from '@/features/users/components';
import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import customToast from '@/utils/custom-toast';
import { MailPlus, PlusIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Station } from '../types/station.types';
import { AddedListWrapper } from './added-list-wrapper';

export const AddByEmail = ({
  station,
  addedEmails,
  setAddedEmails,
}: {
  station: Station;
  addedEmails: string[];
  setAddedEmails: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation('common');

  const user = useAuthStore((state) => state.user);

  const handleAddEmail = useCallback(() => {
    if (!inputValue) return;
    if (addedEmails.includes(inputValue)) {
      customToast.error(t('MESSAGE.ERROR.USER_ALREADY_ADDED'));
      return;
    }
    if (user?.email === inputValue) {
      customToast.error(t('MESSAGE.ERROR.CANT_ADD_YOURSELF'));
      return;
    }
    setInputValue('');
  }, [addedEmails, inputValue, t, user?.email]);

  return (
    <div>
      <div className={cn(addedEmails.length > 0 && 'border-b pb-4')}>
        <div className="flex w-full items-center gap-2">
          <SearchInput
            leftElement={
              <div className="my-auto flex h-full shrink-0 items-center justify-center pl-2 text-neutral-800">
                <MailPlus className="size-5" />
              </div>
            }
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('COMMON.EMAIL')}
            onEnter={handleAddEmail}
            autoFocus
            showSearchButton={false}
          />
          <Button
            // onClick={handleSearch}
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
        {/* <SearchList
          items={selectedUsers ?? []}
          onItemClick={handleSelectUser}
          selectedItems={selectedUsers}
          itemClassName="!p-3"
        /> */}
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
    <AddedListWrapper>
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
    </AddedListWrapper>
  );
};
