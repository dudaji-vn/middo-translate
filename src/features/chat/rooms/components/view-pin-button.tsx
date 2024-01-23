import { Button } from '@/components/actions';
import { useRoomSidebarTabs } from './room-side/room-side-tabs/room-side-tabs.hook';

export interface ViewPinButtonProps {}

export const ViewPinButton = (props: ViewPinButtonProps) => {
  const { toggleTab, currentSide } = useRoomSidebarTabs();
  const isShowPinned = currentSide === 'pinned';
  return (
    <Button
      onClick={() => toggleTab('pinned')}
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
