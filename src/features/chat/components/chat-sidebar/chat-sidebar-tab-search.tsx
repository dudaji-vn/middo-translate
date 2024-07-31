import { Section } from '@/components/data-display/section';
import { searchApi } from '@/features/search/api';
import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useCallback, useRef } from 'react';

import { Button } from '@/components/actions';
import { SearchTabs } from '@/features/search/components/search-tabs';
import { useSearchStore } from '@/features/search/store/search.store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, PaintbrushIcon, SearchIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { useBusinessNavigationData, useStationNavigationData } from '@/hooks';
import { useAppStore } from '@/stores/app.store';
import { SearchInput, SearchInputRef } from '@/components/data-entry';
import { useSideChatStore } from '../../stores/side-chat.store';
export interface SearchTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SearchTab = forwardRef<HTMLDivElement, SearchTabProps>(
  (props, ref) => {
    const { searchValue, setSearchValue } = useSearchStore((state) => state);
    const { currentSide, setCurrentSide } = useSideChatStore();
    const { t } = useTranslation('common');
    const searchInputRef = useRef<SearchInputRef>(null);
    const { isBusiness } = useBusinessNavigationData();
    const isMobile = useAppStore((state) => state.isMobile);
    const handleBack = useCallback(() => {
      setCurrentSide('');
      searchInputRef.current?.reset();
      setSearchValue('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setCurrentSide]);
    return (
      <div
        className={cn(
          'absolute left-0  w-full overflow-y-auto',
          isBusiness && !isMobile
            ? 'top-[112px] h-[calc(100%_-_112px)]'
            : 'top-[184px] h-[calc(100%_-_184px)] md:top-[174px] md:h-[calc(100%_-_174px)]',
          isMobile && 'left-0 top-0 h-full',
        )}
      >
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          ref={ref}
          className="flex h-full w-full flex-col bg-neutral-white dark:bg-neutral-950"
        >
          {isMobile && (
            <div className="flex gap-2 p-3 pl-0">
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout="size"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Button.Icon
                    size="xs"
                    variant="ghost"
                    color="default"
                    onClick={handleBack}
                  >
                    <ArrowLeftIcon />
                  </Button.Icon>
                </motion.div>

                <motion.div key="search-input-main" className="w-full">
                  <SearchInput
                    ref={searchInputRef}
                    value={searchValue}
                    autoFocus
                    onFocus={() => {
                      setCurrentSide('search');
                    }}
                    btnDisabled
                    placeholder={t('COMMON.SEARCH')}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                    onClear={handleBack}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
          {searchValue ? (
            <SearchTabs onItemClicked={handleBack} searchValue={searchValue} />
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
  const { stationId } = useStationNavigationData();
  const { spaceId } = useBusinessNavigationData();
  const { t } = useTranslation('common');
  const { data, refetch } = useQuery({
    queryKey: ['searchHistory'],
    queryFn: () =>
      searchApi.getKeywords({
        stationId,
        spaceId: spaceId as string,
      }),
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
    <div className="flex flex-1 flex-col overflow-hidden pt-3">
      <Section
        label={t('COMMON.SEARCH_HISTORY')}
        labelRight={
          <Button
            disabled={!data?.length}
            onClick={() => {
              clearAll({ stationId, spaceId: spaceId as string });
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
        <></>
      </Section>
      <div className="flex-1 overflow-auto">
        {data?.map((item) => (
          <SearchKeyword
            onClick={setSearchValue.bind(null, item.keyword)}
            onClear={
              item.keyword
                ? () => {
                    deleteOne({
                      keyword: item.keyword,
                      stationId,
                      spaceId: spaceId as string,
                    });
                  }
                : undefined
            }
            key={item.keyword}
          >
            {item.keyword}
          </SearchKeyword>
        ))}
      </div>
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
