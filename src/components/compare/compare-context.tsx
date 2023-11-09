'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addAcceptDiffResult,
  getAcceptDiffResult,
} from '@/utils/local-storage';

import { useSetParams } from '@/hooks/use-set-params';

type CompareContext = {
  isMatch: boolean;
  acceptUnMatch: () => void;
  editUnMatch: () => void;
};

export const CompareContext = createContext<CompareContext>({
  isMatch: false,
  acceptUnMatch: () => {},
  editUnMatch: () => {},
});

export const useCompare = () => {
  return useContext(CompareContext);
};
interface CompareProviderProps extends PropsWithChildren {
  text: string;
  textCompare: string;
}
export const CompareProvider = ({
  children,
  text,
  textCompare,
}: CompareProviderProps) => {
  const [acceptList, setAcceptList] = useState<Record<string, string>>({});

  const { setParams } = useSetParams();
  const isMatch = useMemo(() => {
    if (!text || !textCompare) return true;
    if (acceptList[text]) return true;
    console.log('text', text);
    console.log('textCompare', textCompare);
    return text.toLocaleLowerCase() === textCompare.toLocaleLowerCase();
  }, [acceptList, text, textCompare]);
  const handleAccept = () => {
    addAcceptDiffResult(text, textCompare);
    setAcceptList((prev) => ({
      ...prev,
      [text]: textCompare,
    }));
  };

  const handleClickEdit = () => {
    setParams([
      {
        key: 'edit',
        value: 'true',
      },
    ]);
  };

  useEffect(() => {
    setAcceptList(getAcceptDiffResult());
  }, []);

  return (
    <CompareContext.Provider
      value={{
        isMatch,
        acceptUnMatch: handleAccept,
        editUnMatch: handleClickEdit,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
