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
import { cn } from '@/utils/cn';
import { useBusinessNavigationData } from '@/hooks';
export interface SearchTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SearchTab = forwardRef<HTMLDivElement, SearchTabProps>(
  (props, ref) => {
    const searchValue = useSearchStore((state) => state.searchValue);
    const { isBusiness } = useBusinessNavigationData();
    console.log('isBusiness', isBusiness);
    return (
      <div
        className={cn(
          'absolute left-0  w-full overflow-y-auto',
          isBusiness
            ? 'top-[112px] h-[calc(100%_-_112px)]'
            : 'top-[184px] h-[calc(100%_-_184px)] md:top-[174px] md:h-[calc(100%_-_174px)]',
        )}
      >
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          ref={ref}
          className="flex h-full w-full flex-col bg-neutral-white dark:bg-neutral-950"
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
    <div className="pt-3">
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
    </div>
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
      className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-neutral-50 active:bg-neutral-100 dark:hover:bg-neutral-900 dark:active:bg-neutral-800"
    >
      <div className="flex items-center gap-2">
        <SearchIcon className="size-4 text-primary" />
        <div className="text-base text-neutral-800 dark:text-neutral-50">
          {' '}
          {children}
        </div>
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
