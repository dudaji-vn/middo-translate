'use client';

import { PropsWithChildren, createContext, useContext, useState } from 'react';
import IDoodleImage from '../interfaces/doodle-image.inteface';


interface DoodleContextProps {
  imagesCanvas: IDoodleImage;
  setImagesCanvas: (imagesCanvas: IDoodleImage) => void;
  isShowConfirmClear: boolean;
  setShowConfirmClear: (isShowConfirmClear: boolean) => void;
}

const DoodleContext = createContext<DoodleContextProps>(
  {} as DoodleContextProps,
);

export const DoodleProvider = ({ children }: PropsWithChildren) => {
  const [imagesCanvas, setImagesCanvas] = useState<IDoodleImage>({});
  const [isShowConfirmClear, setShowConfirmClear] = useState(false);
  return (
    <DoodleContext.Provider
      value={{
        imagesCanvas,
        setImagesCanvas,
        isShowConfirmClear,
        setShowConfirmClear,
      }}
    >
      {children}
    </DoodleContext.Provider>
  );
};

export const useDoodleContext = () => {
  const context = useContext(DoodleContext);
  if (!context) {
    throw new Error(
      'useDoodleContext must be used within DoodleProvider',
    );
  }
  return context;
};
