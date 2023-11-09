'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useRef,
} from 'react';

import { toJpeg } from 'html-to-image';

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
  const onButtonClick = useCallback(() => {
    if (refCapture.current === null) {
      return;
    }

    toJpeg(refCapture.current, { cacheBust: true, backgroundColor: '#fff' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refCapture]);

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
