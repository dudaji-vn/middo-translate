import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, PenSquareIcon, Settings } from 'lucide-react';
import { SPK_CHAT_TAB, SPK_SEARCH } from '../../configs';
import { SearchInput, SearchInputRef } from '@/components/data-entry';
import { useCallback, useEffect, useRef } from 'react';

import { Button } from '@/components/actions';
import { ChatSettingMenu } from '../chat-setting';
import { useSidebarTabs } from '../../hooks';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { Typography } from '@/components/data-display';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';

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

  const handleNewConversation = useCallback(() => {
    changeSide('individual');
  }, [changeSide]);

  useKeyboardShortcut([SHORTCUTS.NEW_CONVERSATION], handleNewConversation);

  const handleBack = useCallback(() => {
    removeParams([SPK_SEARCH, SPK_CHAT_TAB]);
    searchInputRef.current?.reset();
  }, [removeParams, searchInputRef]);

  useEffect(() => {
    if (searchParams?.get(SPK_SEARCH) === null) {
      searchInputRef.current?.reset();
    }
  }, [searchParams]);

  return (
    <div className="w-full px-3 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <Typography variant="h6">Conversation</Typography>
        <div className="flex gap-3">
          <Tooltip
            title="New Conversation"
            triggerItem={
              <Button.Icon
                onClick={handleNewConversation}
                color="default"
                size="xs"
              >
                <PenSquareIcon />
              </Button.Icon>
            }
          ></Tooltip>
          <Tooltip
            title="Settings"
            triggerItem={
              <ChatSettingMenu>
                <Button.Icon color="default" size="xs">
                  <Settings />
                </Button.Icon>
              </ChatSettingMenu>
            }
          ></Tooltip>
        </div>
      </div>
      <div className="flex  items-center gap-1 ">
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
    </div>
  );
};

export default ChatSidebarHeader;
