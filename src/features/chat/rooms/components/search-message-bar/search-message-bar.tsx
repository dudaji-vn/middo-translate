'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { SearchInput } from '@/components/data-entry';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/feedback';
import { useRoomSearchStore } from '@/features/chat/stores/room-search.store';
import { searchApi } from '@/features/search/api';
import { MessagesList } from '@/features/search/components/search-tabs';
import { useSetParams } from '@/hooks/use-set-params';
import { useMutation } from '@tanstack/react-query';
import { ChevronDown, ChevronUpIcon, SearchIcon, XIcon } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoomId } from '../../hooks/use-roomId';
export interface SearchMessageBarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SearchMessageBar = forwardRef<
  HTMLDivElement,
  SearchMessageBarProps
>((props, ref) => {
  const roomId = useRoomId();
  const { isShowSearch, toggleIsShowSearch } = useRoomSearchStore();
  const { t } = useTranslation('common');
  const [searchInput, setSearchInput] = useState('');
  const [open, setOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const disabled = !searchInput || !roomId;
  const { pushParam, removeParam } = useSetParams();

  const { data, mutate, isLoading } = useMutation({
    mutationFn: searchApi.messageInRoom,
  });

  const handleSearch = () => {
    if (disabled) return;
    mutate({ roomId, query: { q: searchInput } });
  };
  const messages = useMemo(() => {
    const result = data || [];
    if (result.length) {
      setSearchId(result[0]._id);
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (searchId) {
      pushParam('search_id', searchId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId]);

  const { canMoveDown, canMoveUp } = useMemo(() => {
    if (messages.length === 0) return { canMoveUp: false, canMoveDown: false };
    const canMoveUp = messages[messages.length - 1]?._id !== searchId;
    const canMoveDown = messages[0]?._id !== searchId;
    return { canMoveUp, canMoveDown };
  }, [messages, searchId]);

  const handleMoveUp = () => {
    if (!canMoveUp) return;
    const index = messages.findIndex((message) => message._id === searchId);
    setSearchId(messages[index + 1]?._id || '');
  };
  const handleMoveDown = () => {
    if (!canMoveDown) return;
    const index = messages.findIndex((message) => message._id === searchId);
    setSearchId(messages[index - 1]?._id || '');
  };

  return (
    <div
      ref={ref}
      {...props}
      className={'flex items-center gap-3 border-b p-3'}
    >
      <SearchInput
        onClear={() => {
          setSearchInput('');
          removeParam('search_id');
          mutate({ roomId: '', query: { q: '' } });
        }}
        onEnter={handleSearch}
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
        placeholder="Search messages"
        className="flex-1"
      />
      <Button.Icon
        disabled={disabled}
        loading={isLoading}
        onClick={handleSearch}
        size="xs"
      >
        <SearchIcon />
      </Button.Icon>
      <div className="flex shrink-0 items-center gap-2">
        <Button.Icon
          onClick={handleMoveUp}
          disabled={!canMoveUp}
          color="default"
          size="xs"
        >
          <ChevronUpIcon />
        </Button.Icon>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger disabled={!messages.length}>
            <div className="hover:opacity-80">
              <Typography variant="default">
                {messages.length}{' '}
                {/* {messages.length > 1
              ? t('CONVERSATION.MESSAGES')
              : t('CONVERSATION.MESSAGE')} */}
                {messages.length > 1 ? 'results' : 'result'}
              </Typography>
            </div>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {/* {t('CONVERSATION.MESSAGE_REACTION')} */}
                Search results
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <MessagesList
                onItemClick={() => setOpen(false)}
                messages={messages}
                searchValue={searchInput}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogAction>{t('COMMON.CLOSE')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button.Icon
          onClick={handleMoveDown}
          disabled={!canMoveDown}
          color="default"
          size="xs"
        >
          <ChevronDown />
        </Button.Icon>
      </div>
      <Button.Icon
        color="default"
        onClick={() => {
          toggleIsShowSearch();
          removeParam('search_id');
        }}
        variant="ghost"
        size="xs"
      >
        <XIcon />
      </Button.Icon>
    </div>
  );
});
SearchMessageBar.displayName = 'SearchMessageBar';
