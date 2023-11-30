'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
} from 'react';

import { copyBlobToClipboard } from 'copy-image-clipboard';
import { toBlob } from 'html-to-image';
import { useToast } from '@/components/feedback';

type CaptureContext = {
  captureRef?: React.RefObject<HTMLDivElement>;
  onCapture: () => void;
};

export const CaptureContext = createContext<CaptureContext>({
  onCapture: () => {},
});

export const useCapture = () => {
  return useContext(CaptureContext);
};
interface CaptureProviderProps extends PropsWithChildren {}
export const CaptureProvider = ({ children }: CaptureProviderProps) => {
  const refCapture = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const onButtonClick = useCallback(() => {
    if (refCapture.current === null) {
      return;
    }
    toBlob(refCapture.current, { cacheBust: true, backgroundColor: '#fff' })
      .then(async (blob) => {
        copyBlobToClipboard(blob as Blob);
        toast({
          description: 'Image copied!',
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CaptureContext.Provider
      value={{
        onCapture: onButtonClick,
        captureRef: refCapture,
      }}
    >
      {children}
    </CaptureContext.Provider>
  );
};
