import { useRoomSearchStore } from '@/features/chat/stores/room-search.store';
import {
  useScrollDistanceFromTop,
  useScrollIntoView,
  useSetParams,
} from '@/hooks';
import { useEffect, useRef, useState } from 'react';

export const useMessageBoxScroll = () => {
  const setIsShowSearch = useRoomSearchStore((s) => s.setIsShowSearch);
  const [isShowScrollToBottom, setIsShowScrollToBottom] = useState(false);
  const { ref, isScrolled } = useScrollDistanceFromTop(0, true);

  const { removeParam, searchParams } = useSetParams();
  const messageId = searchParams?.get('search_id');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { scrollIntoView } = useScrollIntoView(bottomRef);
  const handleScrollToBottom = () => {
    scrollIntoView();
    if (messageId) {
      removeParam('search_id');
      setIsShowSearch(false);
    }
  };
  useEffect(() => {
    setIsShowScrollToBottom(isScrolled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrolled]);
  return {
    bottomRef,
    handleScrollToBottom,
    ref,
    isShowScrollToBottom,
    setIsShowScrollToBottom,
  };
};
