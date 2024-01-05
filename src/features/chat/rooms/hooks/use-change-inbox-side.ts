import { InboxSides } from '../types';
import { SPK_INBOX_SIDE } from '../configs';
import { useSetParams } from '@/hooks/use-set-params';

export const useChangeInboxSide = () => {
  const { setParam, searchParams, removeParam } = useSetParams();
  const currentSide = searchParams?.get(SPK_INBOX_SIDE) as InboxSides;
  const changeSide = (side: InboxSides) => {
    setParam(SPK_INBOX_SIDE, side);
  };
  const changeToDefault = () => {
    removeParam(SPK_INBOX_SIDE);
  };
  return {
    changeSide,
    currentSide,
    changeToDefault,
    setParam,
    searchParams,
    removeParam,
  };
};
