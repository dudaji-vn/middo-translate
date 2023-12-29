import { SPK_CHAT_TAB, SPK_SEARCH } from '../../configs';
import { SearchInput, SearchInputRef } from '@/components/data-entry';
import { useCallback, useRef } from 'react';

import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/actions';
import { useSidebarTabs } from '../../hooks';

export interface ChatSidebarHeaderProps {}

const ChatSidebarHeader = (props: ChatSidebarHeaderProps) => {
  const {
    changeSide,
    currentSide,
    searchParams,
    setParam,
    removeParam,
    removeParams,
  } = useSidebarTabs();
  const searchValue = searchParams?.get(SPK_SEARCH);
  const isSearch = currentSide === 'search';
  const searchInputRef = useRef<SearchInputRef>(null);
  const handleClear = useCallback(() => {
    removeParam(SPK_SEARCH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => {
    removeParams([SPK_SEARCH, SPK_CHAT_TAB]);
    searchInputRef.current?.reset();
  }, [removeParams, searchInputRef]);
  return (
    <div className="flex w-full gap-1 px-3 pt-3">
      {isSearch && (
        <Button.Icon
          variant="ghost"
          color="default"
          onClick={handleBack}
          className="-ml-2"
        >
          <ArrowLeftIcon />
        </Button.Icon>
      )}
      <div className="flex-1">
        <SearchInput
          ref={searchInputRef}
          defaultValue={searchValue || ''}
          onFocus={() => changeSide('search')}
          btnDisabled
          placeholder="Search people or groups"
          onChange={(e) => setParam(SPK_SEARCH, e.currentTarget.value)}
          onClear={handleClear}
        />
      </div>
    </div>
  );
};

export default ChatSidebarHeader;
