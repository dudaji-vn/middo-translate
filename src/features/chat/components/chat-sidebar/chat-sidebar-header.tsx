'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, Menu, PenSquareIcon, Settings } from 'lucide-react';
import { SPK_CHAT_TAB, SPK_SEARCH } from '../../configs';
import { SearchInput, SearchInputRef } from '@/components/data-entry';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/actions';
import { ChatSettingMenu } from '../chat-setting';
import { useSidebarTabs } from '../../hooks';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { Typography } from '@/components/data-display';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { useSearchStore } from '@/features/search/store/search.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import { cn } from '@/utils/cn';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

export interface ChatSidebarHeaderProps { }
const ChatSidebarHeader = (props: ChatSidebarHeaderProps) => {
  const { changeSide, currentSide, removeParam, removeParams } =
    useSidebarTabs();
  const [openSetting, setOpenSetting] = useState(false);
  const { searchValue, setSearchValue } = useSearchStore();
  const { openSidebar, setOpenSidebar } = useSidebarStore();
  const handleToggleSetting = () => {
    setOpenSetting((prev) => !prev);
  };
  useKeyboardShortcut(
    [SHORTCUTS.TOGGLE_CONVERSATION_SETTINGS],
    handleToggleSetting,
  );
  const isSearch = currentSide === 'search';
  const { isBusiness } = useBusinessNavigationData();
  const searchInputRef = useRef<SearchInputRef>(null);

  const handleNewConversation = useCallback(() => {
    changeSide('individual');
  }, [changeSide]);

  const handleBack = useCallback(() => {
    removeParams([SPK_CHAT_TAB]);
    searchInputRef.current?.reset();
  }, [removeParams, searchInputRef]);


  return (
    <div className="w-full px-3 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <Button.Icon
          onClick={() => setOpenSidebar(!openSidebar, true)}
          color="default"
          size="xs"
          variant={'ghost'}
          className={cn('md:hidden', isBusiness ? '' : 'md:hidden')}
        >
          <Menu />
        </Button.Icon>
        <Typography variant="h6">Conversation</Typography>
        <div className="flex gap-3">
          <Tooltip
            title="New Conversation"
            triggerItem={
              <Button.Icon
                onClick={handleNewConversation}
                color="default"
                className={isBusiness ? 'hidden' : ''}
                size="xs"
              >
                <PenSquareIcon />
              </Button.Icon>
            }
          ></Tooltip>
          <Tooltip
            title="Settings"
            triggerItem={
              <ChatSettingMenu open={openSetting} onOpenChange={setOpenSetting}>
                <Button.Icon color="default" size="xs">
                  <Settings />
                </Button.Icon>
              </ChatSettingMenu>
            }
          ></Tooltip>
        </div>
      </div>
      <div className="flex items-center gap-1 ">
        <AnimatePresence>
          {isSearch && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
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
          )}
          <motion.div key="search-input-main" className="w-full transition-all">
            <SearchInput
              ref={searchInputRef}
              defaultValue={searchValue || ''}
              autoFocus={isSearch}
              onFocus={() => {
                if (currentSide !== 'search') changeSide('search');
              }}
              btnDisabled
              placeholder="Search people or groups"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onClear={() => {
                removeParam(SPK_SEARCH);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatSidebarHeader;
