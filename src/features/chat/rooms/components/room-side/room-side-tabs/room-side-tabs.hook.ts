import { useSetParams } from '@/hooks/use-set-params';
// SPK = Search Params Key
export type RoomSidebarTabs = 'info' | 'discussion';
const SPK_ROOM_TAB = 'r_tab';
export const useRoomSidebarTabs = () => {
  const { searchParams, removeParam, pushParam, ...rest } = useSetParams();
  const currentSide = searchParams?.get(SPK_ROOM_TAB) as RoomSidebarTabs;
  const changeTab = (tab: RoomSidebarTabs) => {
    pushParam(SPK_ROOM_TAB, tab);
  };
  const changeToDefault = () => {
    removeParam(SPK_ROOM_TAB);
  };
  const toggleTab = (tab: RoomSidebarTabs) => {
    if (currentSide === tab) {
      changeToDefault();
    } else {
      changeTab(tab);
    }
  };
  return {
    SPK_ROOM_TAB,
    changeTab,
    toggleTab,
    currentSide,
    changeToDefault,
    searchParams,
    removeParam,
    ...rest,
  };
};
