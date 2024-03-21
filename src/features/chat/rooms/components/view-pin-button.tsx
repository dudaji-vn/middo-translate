import { Button } from '@/components/actions';
import { useRoomSidebarTabs } from './room-side/room-side-tabs/room-side-tabs.hook';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useCallback } from 'react';
import { SHORTCUTS } from '@/types/shortcuts';
import { useTranslation } from 'react-i18next';

export interface ViewPinButtonProps {}

export const ViewPinButton = (props: ViewPinButtonProps) => {
  const { toggleTab, currentSide } = useRoomSidebarTabs();
  const isShowPinned = currentSide === 'pinned';
  const {t} = useTranslation('common');
  const viewPinnedMessages = useCallback(() => {
    toggleTab('pinned');
  }, [toggleTab]);

  useKeyboardShortcut([SHORTCUTS.VIEW_PINNED_MESSAGES], viewPinnedMessages);

  return (
    <Button
      onClick={viewPinnedMessages}
      size="xs"
      shape="square"
      color={isShowPinned ? 'secondary' : 'primary'}
      variant={isShowPinned ? 'default' : 'ghost'}
      className={'ml-auto'}
    >
      {t('COMMON.VIEW')}
    </Button>
  );
};
