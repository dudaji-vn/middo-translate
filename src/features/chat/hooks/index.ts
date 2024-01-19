import { SidebarTabs } from '../types';
import { useSetParams } from '@/hooks/use-set-params';
// SPK = Search Params Key
const SPK_CHAT_TAB = 'c_tab';
export const useSidebarTabs = () => {
  const { pushParam, searchParams, removeParam, ...rest } = useSetParams();
  const currentSide = searchParams?.get(SPK_CHAT_TAB) as SidebarTabs;
  const changeSide = (side: SidebarTabs) => {
    pushParam(SPK_CHAT_TAB, side);
  };
  const changeToDefault = () => {
    removeParam(SPK_CHAT_TAB);
  };
  return {
    changeSide,
    currentSide,
    changeToDefault,
    searchParams,
    removeParam,
    ...rest,
  };
};
