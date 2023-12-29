import { SidebarTabs } from '../types';
import { useSetParams } from '@/hooks/use-set-params';
// SPK = Search Params Key
const SPK_CHAT_TAB = 'c_tab';
export const useSidebarTabs = () => {
  const { setParam, searchParams, removeParam, ...rest } = useSetParams();
  const currentSide = searchParams?.get(SPK_CHAT_TAB) as SidebarTabs;
  const changeSide = (side: SidebarTabs) => {
    setParam(SPK_CHAT_TAB, side);
  };
  const changeToDefault = () => {
    removeParam(SPK_CHAT_TAB);
  };
  return {
    changeSide,
    currentSide,
    changeToDefault,
    setParam,
    searchParams,
    removeParam,
    ...rest,
  };
};
