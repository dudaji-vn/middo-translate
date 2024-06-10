import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import {
  MessagesSquareIcon,
  SearchIcon,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchType } from '../types';

export interface SearchTabsProps {
  searchValue?: string;
  onTabChange?: (type: SearchType) => void;
}

const tabs: Record<
  SearchType,
  { label: string; value: SearchType; icon?: React.ReactNode }
> = {
  all: {
    label: 'COMMON.ALL',
    value: 'all',
    icon: <SearchIcon className="size-5 md:size-4" />,
  },
  user: {
    label: 'COMMON.USER',
    value: 'user',
    icon: <UserRound className="size-5 md:size-4" />,
  },
  group: {
    label: 'COMMON.GROUP',
    value: 'group',
    icon: <UsersRound className="size-5 md:size-4" />,
  },
  message: {
    label: 'COMMON.MESSAGE',
    value: 'message',
    icon: <MessagesSquareIcon className="size-5 md:size-4" />,
  },
};

export const SearchTabs = ({ searchValue, onTabChange }: SearchTabsProps) => {
  const [type, setType] = useState<SearchType>('all');
  const { t } = useTranslation('common');
  // call api to count the number of results for each tab
  return (
    <Tabs defaultValue="all" value={type} className="w-full">
      <TabsList>
        {Object.values(tabs).map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => {
              setType(tab.value);
              onTabChange?.(tab.value);
            }}
            className="!rounded-none"
          >
            <div className="relative">
              {type === tab.value ? (
                <>{t(tab.label)}</>
              ) : (
                <>
                  <div className="h-5"> {tab?.icon || t(tab.label)}</div>
                  {tab.value !== 'all' && (
                    <div className="absolute right-0 top-0 size-4 translate-x-1/2 translate-y-1/2 rounded-full bg-primary text-xs text-white">
                      +9
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
