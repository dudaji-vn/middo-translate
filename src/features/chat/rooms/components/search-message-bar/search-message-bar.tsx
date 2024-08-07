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
import { ChevronDown, ChevronUpIcon, SearchIcon } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
export interface SearchMessageBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  roomId?: string;
}

export const SearchMessageBar = forwardRef<
  HTMLDivElement,
  SearchMessageBarProps
>(({ roomId, ...props }, ref) => {
  const { setIsShowSearch, isShowSearch } = useRoomSearchStore();
  const { t } = useTranslation('common');
  const [searchInput, setSearchInput] = useState('');
  const [open, setOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const disabled = !searchInput || !roomId;
  const { pushParam, removeParam, searchParams, removeParams } = useSetParams();
  const currentValue = searchParams?.get('keyword') || '';

  const { data, mutate, isLoading } = useMutation({
    mutationFn: searchApi.messageInRoom,
  });

  const handleSearch = () => {
    if (disabled) return;
    pushParam('keyword', searchInput);
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

  useEffect(() => {
    if (currentValue && roomId) {
      setSearchInput(currentValue);
      setIsShowSearch(true);
      mutate({ roomId, params: { q: currentValue } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue, roomId]);

  const { canMoveDown, canMoveUp } = useMemo(() => {
    if (messages.length === 0) return { canMoveUp: false, canMoveDown: false };
    const canMoveUp = messages[messages.length - 1]?._id !== searchId;
    const canMoveDown = messages[0]?._id !== searchId;
    return { canMoveUp, canMoveDown };
  }, [messages, searchId]);
  const currentIndex = useMemo(() => {
    if (!searchId || !messages.length) return 0;
    return messages.findIndex((message) => message._id === searchId) + 1;
  }, [searchId, messages]);

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
  const handleClose = () => {
    removeParams(['keyword', 'search_id']);
    setIsShowSearch(false);
  };
  if (!isShowSearch) return null;

  return (
    <div ref={ref} {...props} className={'flex flex-col gap-3 border-b p-3'}>
      <div className="flex items-center gap-3">
        <SearchInput
          onClear={() => {
            setSearchInput('');
            removeParam('search_id');
            mutate({ roomId: '', params: { q: '' } });
          }}
          onEnter={() => {
            if (canMoveUp && currentValue === searchInput) {
              handleMoveUp();
              return;
            }
            if (currentValue === searchInput) return;
            handleSearch();
          }}
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
        <div className="hidden shrink-0 items-center gap-2 md:flex">
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
                  {currentIndex ? currentIndex + '/' : ''}
                  {messages.length} {messages.length > 1 ? 'results' : 'result'}
                </Typography>
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Search results</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="-mx-5 max-h-96 overflow-y-auto">
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
        <Button
          color="default"
          onClick={handleClose}
          shape="square"
          variant="default"
          size="xs"
        >
          {t('COMMON.CLOSE')}
        </Button>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2 md:hidden">
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
                {currentIndex + 1} {messages.length}
                {messages.length > 1 ? 'results' : 'result'}
              </Typography>
            </div>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Search results</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="-mx-5 max-h-96 overflow-y-auto">
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
    </div>
  );
});
SearchMessageBar.displayName = 'SearchMessageBar';
