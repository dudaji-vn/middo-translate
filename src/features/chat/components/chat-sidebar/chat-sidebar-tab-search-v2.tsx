import { Section } from '@/components/data-display/section';
import { searchApi } from '@/features/search/api';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import { Button } from '@/components/actions';
import { SearchTabs } from '@/features/search/components/search-tabs';
import { useSearchStore } from '@/features/search/store/search.store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PaintbrushIcon, SearchIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStationNavigationData } from '@/hooks';
import { cn } from '@/utils/cn';
export interface SearchTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SearchTab = forwardRef<HTMLDivElement, SearchTabProps>(
  (props, ref) => {
    const searchValue = useSearchStore((state) => state.searchValue);
    const { isOnStation } = useStationNavigationData();
    // const { isBusiness, spaceId } = useBusinessNavigationData();
    // const params = useParams();
    // const helpdeskParams = spaceId
    //   ? { type: 'help-desk', spaceId: params?.spaceId as string }
    //   : undefined;

    // const { data: recData } = useGetRoomsRecChat(helpdeskParams);
    // const { businessExtension } = useBusinessExtensionStore();
    // const { t } = useTranslation('common');
    // const { data } = useQuerySearch<{
    //   rooms: Room[];
    //   users: User[];
    // }>({
    //   searchApi: searchApi.inboxes,
    //   queryKey: 'chat-search',
    //   searchTerm: searchValue || '',
    //   helpdeskParams,
    // });

    return (
      <div
        className={cn(
          'absolute left-0  top-[182px] h-[calc(100%_-_106px)] w-full overflow-y-auto bg-white pt-3 md:top-[174px] ',
          // isOnStation
          //   ? 'top-[182px] md:top-[174px]'
          //   : 'top-[114px] md:top-[106px]',
        )}
      >
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          ref={ref}
          className="flex h-full w-full flex-col bg-neutral-white"
        >
          {searchValue ? (
            <SearchTabs searchValue={searchValue} />
          ) : (
            <SearchHistory />
          )}
        </motion.div>
      </div>
    );
  },
);
SearchTab.displayName = 'SearchTab';

const SearchHistory = () => {
  const setSearchValue = useSearchStore((state) => state.setSearchValue);
  const { t } = useTranslation('common');
  const { data, refetch } = useQuery({
    queryKey: ['searchHistory'],
    queryFn: searchApi.getKeywords,
  });
  const { mutate: clearAll } = useMutation({
    mutationFn: searchApi.clearKeywords,
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: deleteOne } = useMutation({
    mutationFn: searchApi.deleteKeyword,
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <Section
      label={t('COMMON.SEARCH_HISTORY')}
      labelRight={
        <Button
          disabled={!data?.length}
          onClick={() => {
            clearAll();
          }}
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
      <div>
        {data?.map((item) => (
          <SearchKeyword
            onClick={setSearchValue.bind(null, item.keyword)}
            onClear={
              item.keyword
                ? () => {
                    deleteOne(item.keyword);
                  }
                : undefined
            }
            key={item.keyword}
          >
            {item.keyword}
          </SearchKeyword>
        ))}
      </div>
    </Section>
  );
};

type SearchKeywordProps = {
  children: React.ReactNode;
  onClick?: () => void;
  onClear?: () => void;
};

const SearchKeyword = ({ children, onClear, onClick }: SearchKeywordProps) => {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-neutral-50 active:bg-neutral-100"
    >
      <div className="flex items-center gap-2">
        <SearchIcon className="size-4 text-primary" />
        <div className="text-base text-neutral-700"> {children}</div>
      </div>
      <Button.Icon
        onClick={(e) => {
          e.stopPropagation();
          onClear?.();
        }}
        variant="ghost"
        size="xs"
        color="default"
      >
        <XIcon />
      </Button.Icon>
    </div>
  );
};
