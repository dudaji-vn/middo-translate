import {
  ACCEPT_DIFF_RESULT,
  LS_LANG_RECENTLY_USED,
  MAX_LANG_RECENTLY_USED,
  OC_INFO,
} from '@/configs/store-key';

export const getAcceptDiffResult = () => {
  const diffResult = localStorage.getItem(ACCEPT_DIFF_RESULT);
  if (diffResult) {
    return JSON.parse(diffResult);
  }
  return {};
};

export const addAcceptDiffResult = (source: string, result: string) => {
  const diffResult = getAcceptDiffResult();
  diffResult[source] = result;
  localStorage.setItem(ACCEPT_DIFF_RESULT, JSON.stringify(diffResult));
};

export const getRecentlyUsed = () => {
  const recentlyUsed = localStorage.getItem(LS_LANG_RECENTLY_USED);
  if (recentlyUsed) {
    return JSON.parse(recentlyUsed);
  }
  return [];
};

export const addRecentlyUsed = (lang: string) => {
  const recentlyUsed = getRecentlyUsed();
  const newRecentlyUsed = recentlyUsed.filter((item: string) => item !== lang);
  newRecentlyUsed.unshift(lang);
  if (newRecentlyUsed.length > MAX_LANG_RECENTLY_USED) {
    newRecentlyUsed.pop();
  }
  localStorage.setItem(LS_LANG_RECENTLY_USED, JSON.stringify(newRecentlyUsed));
  return newRecentlyUsed;
};

export const setOnlineConversionInfo = (info: any) => {
  const oldInfo = getOnlineConversionInfo();
  localStorage.setItem(
    OC_INFO,
    JSON.stringify({
      ...oldInfo,
      ...info,
    }),
  );
};

export const getOnlineConversionInfo = () => {
  const info = localStorage.getItem(OC_INFO);
  if (info) {
    return JSON.parse(info);
  }
  return null;
};

export const removeOnlineConversionInfo = () => {
  localStorage.removeItem(OC_INFO);
};

export const getRoomSetting = () => {
  const roomSetting = localStorage.getItem('ROOM_SETTING');
  if (roomSetting) {
    return JSON.parse(roomSetting);
  }
  return {};
};

export const setRoomSetting = (setting: any) => {
  const oldSetting = getRoomSetting();
  localStorage.setItem(
    'ROOM_SETTING',
    JSON.stringify({
      ...oldSetting,
      ...setting,
    }),
  );
};
