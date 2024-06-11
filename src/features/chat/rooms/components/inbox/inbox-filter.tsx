import { Button } from '@/components/actions';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { useSideChatStore } from '@/features/chat/stores/side-chat.store';
import { ListFilterIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface InboxFilterProps {}
export type FilterType = 'group' | 'unread';
const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'group', label: 'Group' },
  { value: 'unread', label: 'Unread' },
];

export const InboxFilter = (props: InboxFilterProps) => {
  const { t } = useTranslation('common');
  const { filters, setCurrentFilter } = useSideChatStore();
  const handleFilter = (filter: FilterType) => {
    setCurrentFilter(filter);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button.Icon color="default" size="xs">
          <ListFilterIcon />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" dark:border-neutral-800 dark:bg-neutral-900">
        {filterOptions.map((filter) => (
          <DropdownMenuCheckboxItem
            checked={filters.includes(filter.value)}
            className="flex items-center active:bg-primary-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
            key={filter.value}
            onSelect={() => handleFilter(filter.value)}
          >
            {filter.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
