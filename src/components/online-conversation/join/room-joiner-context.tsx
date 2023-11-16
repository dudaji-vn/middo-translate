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
  username: string;
  setUserName: (username: string) => void;
  selectedNativeLanguage: string;
  setSelectedNativeLanguage: (language: string) => void;
  isValid: boolean;
  room: Room;
  hasRememberedInfo: boolean;
};

export const RoomJoinerContext = createContext<RoomJoinerContext>({
  isValid: false,
  username: '',
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
  const [username, setUserName] = useState<string>('');
  const [hasRememberedInfo, setHasRememberedInfo] = useState<boolean>(false);
  const [selectedNativeLanguage, setSelectedNativeLanguage] =
    useState<string>('');

  const isValid = useMemo(() => {
    return !!username && !!selectedNativeLanguage;
  }, [username, selectedNativeLanguage]);

  useEffect(() => {
    const data = getOnlineConversionInfo();
    if (data) {
      setHasRememberedInfo(true);
      const { username, selectedNativeLanguage } = data;
      setUserName(username);
      setSelectedNativeLanguage(selectedNativeLanguage);
    } else {
      setHasRememberedInfo(false);
    }
  }, []);

  return (
    <RoomJoinerContext.Provider
      value={{
        isValid,
        username,
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
