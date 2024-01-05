import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, Settings } from 'lucide-react';
import { SPK_CHAT_TAB, SPK_SEARCH } from '../../configs';
import { SearchInput, SearchInputRef } from '@/components/data-entry';
import { useCallback, useRef } from 'react';

import { Button } from '@/components/actions';
import { ChatSettingMenu } from '../chat-setting';
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

  const handleBack = useCallback(() => {
    removeParams([SPK_SEARCH, SPK_CHAT_TAB]);
    searchInputRef.current?.reset();
  }, [removeParams, searchInputRef]);
  return (
    <div className="flex w-full gap-1 px-3 pt-3">
      <AnimatePresence>
        {isSearch ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button.Icon variant="ghost" color="default" onClick={handleBack}>
              <ArrowLeftIcon />
            </Button.Icon>
          </motion.div>
        ) : (
          <ChatSettingMenu>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Button.Icon variant="ghost" color="default">
                <Settings />
              </Button.Icon>
            </motion.div>
          </ChatSettingMenu>
        )}
      </AnimatePresence>
      <div className="w-full transition-all">
        <SearchInput
          ref={searchInputRef}
          defaultValue={searchValue || ''}
          onFocus={() => changeSide('search')}
          btnDisabled
          placeholder="Search people or groups"
          onChange={(e) => setParam(SPK_SEARCH, e.currentTarget.value)}
          onClear={() => {
            removeParam(SPK_SEARCH);
          }}
        />
      </div>
    </div>
  );
};

export default ChatSidebarHeader;
