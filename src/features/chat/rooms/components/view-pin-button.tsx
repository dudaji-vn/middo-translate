import { Button } from '@/components/actions';
import { useRoomSidebarTabs } from './room-side/room-side-tabs/room-side-tabs.hook';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useCallback } from 'react';

export interface ViewPinButtonProps {}

const SHORTCUT_TOGGLE_PINNED = ['shift', 'p'];
export const ViewPinButton = (props: ViewPinButtonProps) => {
  const { toggleTab, currentSide } = useRoomSidebarTabs();

  const viewPinnedMessages = useCallback(() => {
    toggleTab('pinned');
  }, [toggleTab]);
  useKeyboardShortcut(SHORTCUT_TOGGLE_PINNED, viewPinnedMessages);

  const isShowPinned = currentSide === 'pinned';
  return (
    <Button
      onClick={viewPinnedMessages}
      size="xs"
      shape="square"
      color={isShowPinned ? 'secondary' : 'primary'}
      variant={isShowPinned ? 'default' : 'ghost'}
      className="ml-auto"
    >
      View
    </Button>
  );
};
