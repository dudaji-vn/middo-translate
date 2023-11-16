'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getOnlineConversionInfo } from '@/utils/local-storage';

type RoomCreatorContext = {
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  username: string;
  setUserName: (username: string) => void;
  selectedNativeLanguage: string;
  setSelectedNativeLanguage: (language: string) => void;
  isValid: boolean;
  hasRememberedInfo: boolean;
};

export const RoomCreatorContext = createContext<RoomCreatorContext>({
  selectedLanguages: [],
  setSelectedLanguages: () => {},
  isValid: false,
  username: '',
  setUserName: () => {},
  selectedNativeLanguage: '',
  setSelectedNativeLanguage: () => {},
  hasRememberedInfo: false,
});

export const useRoomCreator = () => {
  return useContext(RoomCreatorContext);
};
interface RoomCreatorProviderProps extends PropsWithChildren {}
export const RoomCreatorProvider = ({ children }: RoomCreatorProviderProps) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [hasRememberedInfo, setHasRememberedInfo] = useState<boolean>(false);
  const [username, setUserName] = useState<string>('');
  const [selectedNativeLanguage, setSelectedNativeLanguage] =
    useState<string>('');

  const isValid = useMemo(() => {
    return (
      selectedLanguages.length > 1 &&
      !!username &&
      !!selectedNativeLanguage &&
      selectedLanguages.includes(selectedNativeLanguage)
    );
  }, [selectedLanguages, username, selectedNativeLanguage]);

  useEffect(() => {
    const data = getOnlineConversionInfo();
    if (data) {
      setHasRememberedInfo(true);
      const { username, selectedLanguages, selectedNativeLanguage } = data;
      setUserName(username);
      setSelectedLanguages(selectedLanguages || []);
      setSelectedNativeLanguage(selectedNativeLanguage || '');
    } else {
      setHasRememberedInfo(false);
    }
  }, []);

  return (
    <RoomCreatorContext.Provider
      value={{
        selectedLanguages,
        isValid,
        setSelectedLanguages,
        username,
        setUserName,
        selectedNativeLanguage,
        setSelectedNativeLanguage,
        hasRememberedInfo,
      }}
    >
      {children}
    </RoomCreatorContext.Provider>
  );
};
