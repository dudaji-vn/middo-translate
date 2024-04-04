'use client';

import { SearchInput, SearchInputRef } from '@/components/data-entry';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, Menu, PenSquareIcon, Settings } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { SPK_CHAT_TAB, SPK_SEARCH } from '../../configs';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useSearchStore } from '@/features/search/store/search.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useSidebarStore } from '@/stores/sidebar.store';
import { SHORTCUTS } from '@/types/shortcuts';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSidebarTabs } from '../../hooks';
import { ChatSettingMenu } from '../chat-setting';
import { useAppStore } from '@/stores/app.store';

export interface ChatSidebarHeaderProps {}
const ChatSidebarHeader = (props: ChatSidebarHeaderProps) => {
  const { changeSide, currentSide, removeParam, removeParams } =
    useSidebarTabs();
  const pingEmptyInbox = useAppStore((state) => state.pingEmptyInbox);
  const [openSetting, setOpenSetting] = useState(false);
  const { searchValue, setSearchValue } = useSearchStore();
  const { openSidebar, setOpenSidebar } = useSidebarStore();
  const { t } = useTranslation('common');
  const pathname = usePathname();
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

  if (pathname?.includes('statistics')) {
    return (
      <Button.Icon
        onClick={() => setOpenSidebar(!openSidebar, true)}
        color="default"
        size="xs"
        variant={'ghost'}
        className={cn('md:hidden', isBusiness ? 'md:hidden' : 'hidden')}
      >
        <Menu />
      </Button.Icon>
    );
  }

  return (
    <div className="w-full px-3 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <Button.Icon
          onClick={() => setOpenSidebar(!openSidebar, true)}
          color="default"
          size="xs"
          variant={'ghost'}
          className={cn('md:hidden', isBusiness ? 'md:hidden' : 'hidden')}
        >
          <Menu />
        </Button.Icon>
        <Typography variant="h6">{t('CONVERSATION.TITLE')}</Typography>
        <div className="flex gap-3">
          <Tooltip
            title={t('TOOL_TIP.NEW_CONVERSATION')}
            triggerItem={
              <div className="relative">
                <Button.Icon
                  onClick={handleNewConversation}
                  color="default"
                  className={isBusiness ? 'hidden' : ''}
                  size="xs"
                >
                  <PenSquareIcon />
                </Button.Icon>
                {pingEmptyInbox && (
                  <div className="absolute left-0 top-0 h-full w-full animate-ping rounded-full ring-2" />
                )}
              </div>
            }
          ></Tooltip>
          <Tooltip
            title={t('TOOL_TIP.SETTINGS')}
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
      <div
        className={cn(
          'flex items-center gap-1 ',
          pathname?.includes('statistics') && 'hidden',
        )}
      >
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
              placeholder={t('CONVERSATION.SEARCH')}
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
