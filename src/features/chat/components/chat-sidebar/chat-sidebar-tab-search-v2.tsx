import { Section } from '@/components/data-display/section';
import { searchApi } from '@/features/search/api';
import { User } from '@/features/users/types';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { Room } from '../../rooms/types';

import { Button } from '@/components/actions';
import { useGetRoomsRecChat } from '@/features/recommendation/hooks';
import { useSearchStore } from '@/features/search/store/search.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useQuerySearch } from '@/hooks/use-query-search';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { PaintbrushIcon, SearchIcon, XIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { SearchTabs } from '@/features/search/components/search-tabs';
export interface SearchTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SearchTab = forwardRef<HTMLDivElement, SearchTabProps>(
  (props, ref) => {
    const searchValue = useSearchStore((state) => state.searchValue);
    const { isBusiness, spaceId } = useBusinessNavigationData();
    const params = useParams();
    const helpdeskParams = spaceId
      ? { type: 'help-desk', spaceId: params?.spaceId as string }
      : undefined;

    const { data: recData } = useGetRoomsRecChat(helpdeskParams);
    const { businessExtension } = useBusinessExtensionStore();
    const { t } = useTranslation('common');
    const { data } = useQuerySearch<{
      rooms: Room[];
      users: User[];
    }>({
      searchApi: searchApi.inboxes,
      queryKey: 'chat-search',
      searchTerm: searchValue || '',
      helpdeskParams,
    });

    return (
      <div className="absolute left-0 top-[114px] h-[calc(100%_-_106px)] w-full overflow-y-auto bg-white pt-3 md:top-[106px]">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          ref={ref}
          className="w-full bg-neutral-white"
        >
          {searchValue ? <SearchTabs /> : <SearchHistory />}
        </motion.div>
      </div>
    );
  },
);
SearchTab.displayName = 'SearchTab';

const SearchHistory = () => {
  const { t } = useTranslation('common');
  const handleClearAll = () => {
    // clear all search history
  };
  const handleClearSearch = () => {
    // clear search history
  };

  return (
    <Section
      label={t('COMMON.SEARCH_HISTORY')}
      labelRight={
        <Button
          startIcon={<PaintbrushIcon />}
          variant={'ghost'}
          shape="square"
          color={'default'}
          size={'xs'}
        >
          {t('COMMON.CLEAR_ALL')}
        </Button>
      }
    >
      {/* <div className="space-y-1">
        <div className="text-sm text-neutral-600">
          {t('SEARCH.NO_SEARCH_HISTORY')}
        </div>
      </div> */}
      <SearchKeyword>Nhật đẹp trai</SearchKeyword>
      <SearchKeyword>Nhật </SearchKeyword>
      <SearchKeyword>Nhật đẹp </SearchKeyword>
      <SearchKeyword>Nhật đẹ</SearchKeyword>
    </Section>
  );
};

type SearchKeywordProps = {
  children: React.ReactNode;
  onClick?: () => void;
  onClear?: () => void;
};

const SearchKeyword = ({ children }: SearchKeywordProps) => {
  return (
    <div className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-neutral-50 active:bg-neutral-100">
      <div className="flex items-center gap-2">
        <SearchIcon className="size-4 text-primary" />
        <div className="text-base text-neutral-700"> {children}</div>
      </div>
      <Button.Icon variant="ghost" size="xs" color="default">
        <XIcon />
      </Button.Icon>
    </div>
  );
};
