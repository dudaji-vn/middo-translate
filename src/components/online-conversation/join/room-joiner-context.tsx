'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Room } from '@/types/room';
import { getOnlineConversionInfo } from '@/utils/local-storage';

type RoomJoinerContext = {
  userName: string;
  setUserName: (userName: string) => void;
  selectedNativeLanguage: string;
  setSelectedNativeLanguage: (language: string) => void;
  isValid: boolean;
  room: Room;
  hasRememberedInfo: boolean;
};

export const RoomJoinerContext = createContext<RoomJoinerContext>({
  isValid: false,
  userName: '',
  setUserName: () => {},
  selectedNativeLanguage: '',
  setSelectedNativeLanguage: () => {},
  room: {} as Room,
  hasRememberedInfo: false,
});

export const useRoomJoiner = () => {
  return useContext(RoomJoinerContext);
};
interface RoomJoinerProviderProps extends PropsWithChildren {
  room: Room;
}
export const RoomJoinerProvider = ({
  children,
  room,
}: RoomJoinerProviderProps) => {
  const [userName, setUserName] = useState<string>('');
  const [hasRememberedInfo, setHasRememberedInfo] = useState<boolean>(false);
  const [selectedNativeLanguage, setSelectedNativeLanguage] =
    useState<string>('');

  const isValid = useMemo(() => {
    return !!userName && !!selectedNativeLanguage;
  }, [userName, selectedNativeLanguage]);

  useEffect(() => {
    const data = getOnlineConversionInfo();

    if (data) {
      setHasRememberedInfo(true);
      const { userName, selectedNativeLanguage } = data;
      setUserName(userName);
      setSelectedNativeLanguage(selectedNativeLanguage);
    } else {
      setHasRememberedInfo(false);
    }
  }, []);

  return (
    <RoomJoinerContext.Provider
      value={{
        isValid,
        userName,
        setUserName,
        selectedNativeLanguage,
        setSelectedNativeLanguage,
        room,
        hasRememberedInfo,
      }}
    >
      {children}
    </RoomJoinerContext.Provider>
  );
};
