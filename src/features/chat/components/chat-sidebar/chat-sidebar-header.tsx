'use client';

import { SearchInput, SearchInputRef } from '@/components/data-entry';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  Menu,
  MoreVerticalIcon,
  PenSquareIcon,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useSearchStore } from '@/features/search/store/search.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useAppStore } from '@/stores/app.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import { SHORTCUTS } from '@/types/shortcuts';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { InboxFilter } from '../../rooms/components/inbox/inbox-filter';
import { RoomsModalFilter } from '../../rooms/components/rooms.modal-filter';
import { useSideChatStore } from '../../stores/side-chat.store';
import { ChatSettingMenu } from '../chat-setting';
import { NewCallIcon } from '@/components/icons/new-call';

export interface ChatSidebarHeaderProps {}
const ChatSidebarHeader = (props: ChatSidebarHeaderProps) => {
  const { currentSide, setCurrentSide } = useSideChatStore();
  const isMobile = useAppStore((state) => state.isMobile);
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
  const { isBusiness, businessConversationType } = useBusinessNavigationData();
  const searchInputRef = useRef<SearchInputRef>(null);
  const title = useMemo(() => {
    if (isBusiness && businessConversationType === 'archived') {
      return t('EXTENSION.ARCHIVED_CONVERSATIONS');
    }
    return t('CONVERSATION.TITLE');
  }, [businessConversationType, isBusiness, t]);

  const handleNewConversation = useCallback(() => {
    setCurrentSide('individual');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => {
    setCurrentSide('');
    searchInputRef.current?.reset();
    setSearchValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentSide]);

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
    <div className="w-full bg-background px-3 pt-3">
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
        <Typography variant="h6" className="dark:text-neutral-50">
          {title}
        </Typography>
        <div className="flex gap-3">
          <Tooltip
            title={t('TOOL_TIP.NEW_CONVERSATION')}
            triggerItem={
              <div className="relative">
                {pingEmptyInbox && !isBusiness && (
                  <div className="absolute left-0 top-0 h-full w-full animate-ping rounded-full ring-2" />
                )}
                <Button.Icon
                  onClick={handleNewConversation}
                  color="default"
                  className={isBusiness ? 'relative hidden' : 'relative'}
                  size="xs"
                >
                  <PenSquareIcon />
                </Button.Icon>
              </div>
            }
          />
          <Tooltip
            title={t('TOOL_TIP.NEW_CALL')}
            triggerItem={
              <div className="relative">
                <Button.Icon
                  onClick={()=>setCurrentSide('new_call')}
                  color="default"
                  className={isBusiness ? 'relative hidden' : 'relative'}
                  size="xs"
                >
                  <NewCallIcon />
                </Button.Icon>
              </div>
            }
          />
          <Tooltip
            title={t('TOOL_TIP.SETTINGS')}
            triggerItem={
              <ChatSettingMenu open={openSetting} onOpenChange={setOpenSetting}>
                <Button.Icon color="default" size="xs">
                  <MoreVerticalIcon />
                </Button.Icon>
              </ChatSettingMenu>
            }
          />
        </div>
      </div>

      {!(isMobile && isSearch) && (
        <div
          className={cn(
            'flex items-center gap-1 ',
            { 'gap-3': isBusiness && !isSearch },
            pathname?.includes('statistics') && 'hidden',
          )}
        >
          <AnimatePresence mode="popLayout">
            {isSearch && (
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
            )}
            <motion.div key="search-input-main" className="w-full">
              <SearchInput
                ref={searchInputRef}
                value={searchValue}
                autoFocus={isSearch}
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
          {!isSearch && (
            <>{isBusiness ? <RoomsModalFilter /> : <InboxFilter />}</>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSidebarHeader;
