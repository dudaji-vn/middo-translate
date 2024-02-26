import { useRoomSidebarTabs } from '../components/room-side/room-side-tabs/room-side-tabs.hook';

export const useViewPin = () => {
  const { pushParams, SPK_ROOM_TAB, removeParams } = useRoomSidebarTabs();
  const onClickReplyMessage = (id: string) => {
    pushParams([
      { key: SPK_ROOM_TAB, value: 'discussion' },
      { key: 'ms_id', value: id },
    ]);
  };
  const onBack = () => {
    removeParams(['ms_id', SPK_ROOM_TAB]);
  };
  return {
    onClickReplyMessage,
    onBack,
  };
};
