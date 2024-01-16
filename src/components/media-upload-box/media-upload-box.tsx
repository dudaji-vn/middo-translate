'use client';

import { FileWithUrl, useSelectFiles } from '@/hooks/use-select-files';
import { PropsWithChildren, createContext, useContext, useEffect } from 'react';

import { DropzoneRootProps } from 'react-dropzone';

interface MediaUploadBoxContextProps {
  files: FileWithUrl[];
  getInputProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  open: () => void;
  removeFile: (file: FileWithUrl) => void;
  handlePasteFile: (
    e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  reset: () => void;
}

export const MediaUploadBoxContext = createContext<MediaUploadBoxContextProps>(
  {} as MediaUploadBoxContextProps,
);

export const MediaUploadBoxProvider = ({
  children,
  onFileUploaded,
}: PropsWithChildren & {
  onFileUploaded?: (files: FileWithUrl[]) => void;
}) => {
  const {
    files,
    getInputProps,
    getRootProps,
    open,
    removeFile,
    handlePasteFile,
    reset,
    uploadedFiles,
  } = useSelectFiles();

  useEffect(() => {
    if (uploadedFiles[uploadedFiles.length - 1]?.uploaded) {
      onFileUploaded?.(uploadedFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles]);
  return (
    <MediaUploadBoxContext.Provider
      value={{
        files,
        getInputProps,
        getRootProps,
        open,
        removeFile,
        handlePasteFile,
        reset,
      }}
    >
      {children}
    </MediaUploadBoxContext.Provider>
  );
};

export const useMediaUploadBox = () => {
  const context = useContext(MediaUploadBoxContext);
  if (!context) {
    throw new Error(
      'useMediaUploadBox must be used within MediaUploadBoxProvider',
    );
  }
  return context;
};
